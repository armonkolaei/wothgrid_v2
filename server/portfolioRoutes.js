import { randomUUID } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { getDb } from './db.js';
import { TYPES, TX_TYPES, summarize, todayStr } from './portfolio.js';

const MAX_AMOUNT = 1e12;
const MAX_ACCOUNTS = 200;
const MAX_GROUPS = 50;
const MAX_TX_PER_ACCOUNT = 5000;

const id = z.string().min(1).max(64);
const name = z.string().trim().min(1, 'Name is required').max(100);
const cents = (n) => Math.round(n * 100) / 100;
const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00Z`)), 'Enter a valid date')
  .refine((s) => s <= nextDay(todayStr()), 'Date cannot be in the future');

function nextDay(s) {
  return new Date(Date.parse(`${s}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
}

const amountField = z.number().finite().min(-MAX_AMOUNT).max(MAX_AMOUNT);

const groupSchema = z.object({ name });

const accountSchema = z.object({
  name,
  type: z.enum(Object.keys(TYPES)),
  groupId: id.nullable().optional(),
  // Optional starting balance, recorded as the first transaction.
  openingBalance: amountField.min(0).optional(),
  openingDate: dateStr.optional(),
});

const accountUpdateSchema = z.object({
  name,
  type: z.enum(Object.keys(TYPES)),
  groupId: id.nullable().optional(),
});

const txSchema = z.object({
  type: z.enum(TX_TYPES),
  amount: amountField,
  date: dateStr,
  note: z.string().trim().max(200).default(''),
});

// Deposits and withdrawals are entered as positive numbers; gains/losses keep their sign.
function signedAmount({ type, amount }) {
  if (type === 'gain') return cents(amount);
  const abs = Math.abs(cents(amount));
  return type === 'in' ? abs : -abs;
}

export function registerPortfolioRoutes(app, requireAuth) {
  const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down' },
  });

  const wrap = (fn) => async (req, res, next) => {
    try {
      await fn(req, res);
    } catch (err) {
      next(err);
    }
  };

  const bad = (res, parsed) => res.status(400).json({ error: parsed.error.issues[0].message });
  const col = async (n) => (await getDb()).collection(n);
  const uid = (req) => String(req.user.sub);

  async function groupExists(userId, groupId) {
    if (!groupId) return true;
    return Boolean(await (await col('groups')).findOne({ _id: groupId, userId }));
  }

  app.use(['/api/portfolio', '/api/groups', '/api/accounts'], requireAuth);
  app.use(['/api/groups', '/api/accounts'], (req, res, next) =>
    req.method === 'GET' ? next() : writeLimiter(req, res, next),
  );

  app.get('/api/portfolio', wrap(async (req, res) => {
    const userId = uid(req);
    const [accounts, groups, transactions] = await Promise.all(
      ['accounts', 'groups', 'transactions'].map(async (n) => (await col(n)).find({ userId }).toArray()),
    );
    res.json(summarize({ accounts, groups, transactions }));
  }));

  // Groups
  app.post('/api/groups', wrap(async (req, res) => {
    const parsed = groupSchema.safeParse(req.body);
    if (!parsed.success) return bad(res, parsed);
    const userId = uid(req);
    const groups = await col('groups');
    if ((await groups.find({ userId }).toArray()).length >= MAX_GROUPS) {
      return res.status(400).json({ error: `You can have up to ${MAX_GROUPS} groups` });
    }
    const group = { _id: randomUUID(), userId, name: parsed.data.name, createdAt: new Date() };
    await groups.insertOne(group);
    res.status(201).json({ id: group._id, name: group.name });
  }));

  app.patch('/api/groups/:id', wrap(async (req, res) => {
    const parsed = groupSchema.safeParse(req.body);
    const gid = id.safeParse(req.params.id);
    if (!parsed.success || !gid.success) return bad(res, parsed.success ? gid : parsed);
    const r = await (await col('groups')).updateOne(
      { _id: gid.data, userId: uid(req) },
      { $set: { name: parsed.data.name } },
    );
    if (!r.matchedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ id: gid.data, name: parsed.data.name });
  }));

  app.delete('/api/groups/:id', wrap(async (req, res) => {
    const gid = id.safeParse(req.params.id);
    if (!gid.success) return res.status(404).json({ error: 'Not found' });
    const userId = uid(req);
    const r = await (await col('groups')).deleteOne({ _id: gid.data, userId });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    // Accounts in the group become uncategorized.
    await (await col('accounts')).updateMany({ userId, groupId: gid.data }, { $set: { groupId: null } });
    res.json({ ok: true });
  }));

  // Accounts (holdings / liabilities)
  app.post('/api/accounts', wrap(async (req, res) => {
    const parsed = accountSchema.safeParse(req.body);
    if (!parsed.success) return bad(res, parsed);
    const userId = uid(req);
    const d = parsed.data;
    const accounts = await col('accounts');
    if ((await accounts.find({ userId }).toArray()).length >= MAX_ACCOUNTS) {
      return res.status(400).json({ error: `You can track up to ${MAX_ACCOUNTS} accounts` });
    }
    if (!(await groupExists(userId, d.groupId))) return res.status(400).json({ error: 'Group not found' });

    const account = {
      _id: randomUUID(),
      userId,
      name: d.name,
      type: d.type,
      groupId: d.groupId ?? null,
      createdAt: new Date(),
    };
    await accounts.insertOne(account);
    if (d.openingBalance) {
      await (await col('transactions')).insertOne({
        _id: randomUUID(),
        userId,
        accountId: account._id,
        type: 'in',
        amount: cents(d.openingBalance),
        date: d.openingDate ?? todayStr(),
        note: 'Opening balance',
        createdAt: new Date(),
      });
    }
    res.status(201).json({ id: account._id });
  }));

  app.patch('/api/accounts/:id', wrap(async (req, res) => {
    const parsed = accountUpdateSchema.safeParse(req.body);
    const aid = id.safeParse(req.params.id);
    if (!parsed.success || !aid.success) return bad(res, parsed.success ? aid : parsed);
    const userId = uid(req);
    const d = parsed.data;
    if (!(await groupExists(userId, d.groupId))) return res.status(400).json({ error: 'Group not found' });
    const accounts = await col('accounts');
    const existing = await accounts.findOne({ _id: aid.data, userId });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    // Switching between asset and liability would silently flip the sign of its balance.
    if (TYPES[existing.type] !== TYPES[d.type]) {
      return res.status(400).json({ error: 'An asset cannot be changed into a liability' });
    }
    await accounts.updateOne(
      { _id: aid.data, userId },
      { $set: { name: d.name, type: d.type, groupId: d.groupId ?? null } },
    );
    res.json({ ok: true });
  }));

  app.delete('/api/accounts/:id', wrap(async (req, res) => {
    const aid = id.safeParse(req.params.id);
    if (!aid.success) return res.status(404).json({ error: 'Not found' });
    const userId = uid(req);
    const r = await (await col('accounts')).deleteOne({ _id: aid.data, userId });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    await (await col('transactions')).deleteMany({ userId, accountId: aid.data });
    res.json({ ok: true });
  }));

  // Transactions
  async function ownedAccount(req, res) {
    const aid = id.safeParse(req.params.id);
    const account = aid.success && (await (await col('accounts')).findOne({ _id: aid.data, userId: uid(req) }));
    if (!account) res.status(404).json({ error: 'Not found' });
    return account;
  }

  app.get('/api/accounts/:id/transactions', wrap(async (req, res) => {
    const account = await ownedAccount(req, res);
    if (!account) return;
    const list = await (await col('transactions')).find({ userId: uid(req), accountId: account._id }).toArray();
    list.sort((a, b) => (a.date === b.date ? String(b.createdAt) < String(a.createdAt) ? -1 : 1 : a.date > b.date ? -1 : 1));
    res.json(list.map((t) => ({ id: t._id, type: t.type, amount: t.amount, date: t.date, note: t.note })));
  }));

  app.post('/api/accounts/:id/transactions', wrap(async (req, res) => {
    const account = await ownedAccount(req, res);
    if (!account) return;
    const parsed = txSchema.safeParse(req.body);
    if (!parsed.success) return bad(res, parsed);
    const userId = uid(req);
    const txs = await col('transactions');
    if ((await txs.find({ userId, accountId: account._id }).toArray()).length >= MAX_TX_PER_ACCOUNT) {
      return res.status(400).json({ error: 'Transaction limit reached for this account' });
    }
    const t = {
      _id: randomUUID(),
      userId,
      accountId: account._id,
      type: parsed.data.type,
      amount: signedAmount(parsed.data),
      date: parsed.data.date,
      note: parsed.data.note,
      createdAt: new Date(),
    };
    await txs.insertOne(t);
    res.status(201).json({ id: t._id });
  }));

  app.patch('/api/accounts/:id/transactions/:tid', wrap(async (req, res) => {
    const account = await ownedAccount(req, res);
    if (!account) return;
    const tid = id.safeParse(req.params.tid);
    const parsed = txSchema.safeParse(req.body);
    if (!parsed.success || !tid.success) return bad(res, parsed.success ? tid : parsed);
    const r = await (await col('transactions')).updateOne(
      { _id: tid.data, userId: uid(req), accountId: account._id },
      {
        $set: {
          type: parsed.data.type,
          amount: signedAmount(parsed.data),
          date: parsed.data.date,
          note: parsed.data.note,
        },
      },
    );
    if (!r.matchedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  }));

  app.delete('/api/accounts/:id/transactions/:tid', wrap(async (req, res) => {
    const account = await ownedAccount(req, res);
    if (!account) return;
    const tid = id.safeParse(req.params.tid);
    if (!tid.success) return res.status(404).json({ error: 'Not found' });
    const r = await (await col('transactions')).deleteOne({
      _id: tid.data,
      userId: uid(req),
      accountId: account._id,
    });
    if (!r.deletedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  }));
}
