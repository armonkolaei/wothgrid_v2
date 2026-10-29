import { randomUUID, timingSafeEqual } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { getDb } from './db.js';
import { encrypt } from './crypto.js';
import { PROVIDERS, listProviders } from './integrations/index.js';
import { syncConnection, syncDue } from './sync.js';

const MAX_CONNECTIONS = 5;

const connectSchema = z.object({
  provider: z.string().refine((p) => Object.hasOwn(PROVIDERS, p), 'Unknown institution'),
  token: z
    .string()
    .trim()
    .min(10, 'Paste the full API token')
    .max(300)
    .regex(/^[A-Za-z0-9_\-=.+/]+$/, 'That does not look like a valid API token'),
});

const idSchema = z.string().min(1).max(64);

const publicConnection = (c, accounts = 0) => ({
  id: c._id,
  provider: c.provider,
  name: PROVIDERS[c.provider]?.name ?? c.provider,
  status: c.status,
  lastError: c.lastError ?? null,
  lastSyncAt: c.lastSyncAt && c.lastSyncAt.getTime() > 0 ? c.lastSyncAt : null,
  accounts,
});

export function registerConnectionRoutes(app, requireAuth) {
  const perUser = (limit, windowMs, message) =>
    rateLimit({
      windowMs,
      limit,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => String(req.user?.sub ?? 'anon'),
      validate: { keyGeneratorIpFallback: false },
      message: { error: message },
    });
  const connectLimiter = perUser(10, 60 * 60 * 1000, 'Too many connection attempts, try again later');
  const syncLimiter = perUser(6, 10 * 60 * 1000, 'You are syncing too often, try again in a few minutes');

  const wrap = (fn) => async (req, res, next) => {
    try {
      await fn(req, res);
    } catch (err) {
      next(err);
    }
  };
  const col = async (n) => (await getDb()).collection(n);
  const uid = (req) => String(req.user.sub);

  app.use(['/api/institutions', '/api/connections', '/api/sync'], requireAuth);

  app.get('/api/institutions', (req, res) => res.json(listProviders()));

  async function countAccounts(userId, connectionId) {
    return (await (await col('accounts')).find({ userId, connectionId }).toArray()).length;
  }

  app.get('/api/connections', wrap(async (req, res) => {
    const userId = uid(req);
    const list = await (await col('connections')).find({ userId }).toArray();
    res.json(await Promise.all(list.map(async (c) => publicConnection(c, await countAccounts(userId, c._id)))));
  }));

  app.post('/api/connections', connectLimiter, wrap(async (req, res) => {
    const parsed = connectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const { provider, token } = parsed.data;
    const userId = uid(req);
    const connections = await col('connections');

    const previous = await connections.findOne({ userId, provider });
    let conn;
    if (previous) {
      await connections.updateOne({ _id: previous._id }, { $set: { secret: encrypt(token), status: 'pending' } });
      conn = await connections.findOne({ _id: previous._id });
    } else {
      if ((await connections.find({ userId }).toArray()).length >= MAX_CONNECTIONS) {
        return res.status(400).json({ error: `You can connect up to ${MAX_CONNECTIONS} institutions` });
      }
      conn = {
        _id: randomUUID(), userId, provider, secret: encrypt(token), status: 'pending',
        lastError: null, lastSyncAt: new Date(0), lockUntil: 0, createdAt: new Date(),
      };
      await connections.insertOne(conn);
    }

    const result = await syncConnection(conn);
    if (result.status === 'needs_reauth') {
      if (previous) {
        await connections.updateOne(
          { _id: previous._id },
          { $set: { secret: previous.secret, status: previous.status, lastError: previous.lastError ?? null } },
        );
      } else {
        await connections.deleteOne({ _id: conn._id, userId });
      }
      return res.status(400).json({ error: 'The institution rejected that token. Check that it is current and try again.' });
    }
    if (result.status === 'busy') return res.status(409).json({ error: 'A sync is already running. Try again shortly.' });

    const saved = await connections.findOne({ _id: conn._id });
    res.status(201).json({
      ...publicConnection(saved, await countAccounts(userId, conn._id)),
      warning: result.status === 'error' ? 'Saved, but the first sync failed. Try Sync again shortly.' : undefined,
    });
  }));

  app.post('/api/sync', syncLimiter, wrap(async (req, res) => {
    const userId = uid(req);
    const list = await (await col('connections')).find({ userId }).toArray();
    const results = [];
    for (const conn of list) {
      const r = await syncConnection(conn);
      results.push({ id: conn._id, name: PROVIDERS[conn.provider]?.name, status: r.status });
    }
    res.json({ results });
  }));

  app.delete('/api/connections/:id', wrap(async (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    const userId = uid(req);
    const connections = await col('connections');
    if (!id.success || !(await connections.findOne({ _id: id.data, userId }))) {
      return res.status(404).json({ error: 'Not found' });
    }
    const accounts = await col('accounts');
    for (const a of await accounts.find({ userId, connectionId: id.data }).toArray()) {
      await (await col('transactions')).deleteMany({ userId, accountId: a._id });
      await (await col('positions')).deleteMany({ userId, accountId: a._id });
      await accounts.deleteOne({ _id: a._id, userId });
    }
    await connections.deleteOne({ _id: id.data, userId });
    res.json({ ok: true });
  }));

  app.get('/api/accounts/:id/positions', wrap(async (req, res) => {
    const id = idSchema.safeParse(req.params.id);
    const userId = uid(req);
    const account = id.success && (await (await col('accounts')).findOne({ _id: id.data, userId }));
    if (!account) return res.status(404).json({ error: 'Not found' });
    const list = await (await col('positions')).find({ userId, accountId: account._id }).toArray();
    list.sort((a, b) => b.marketValue - a.marketValue);
    res.json({
      cash: account.cash ?? 0,
      syncedAt: account.syncedAt ?? null,
      positions: list.map(({ symbol, quantity, price, marketValue, avgCost, openPnl, currency }) => ({
        symbol, quantity, price, marketValue, avgCost, openPnl, currency,
      })),
    });
  }));

  // Called daily by Vercel Cron, which sends "Authorization: Bearer $CRON_SECRET".
  app.get('/api/cron/sync', wrap(async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (!secret || secret.length < 16) return res.status(503).json({ error: 'Cron is not configured' });
    const given = Buffer.from(req.get('authorization') ?? '');
    const expected = Buffer.from(`Bearer ${secret}`);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(await syncDue());
  }));
}
