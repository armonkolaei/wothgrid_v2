import { createHash, randomUUID } from 'node:crypto';
import { getDb } from './db.js';
import { encrypt, decrypt } from './crypto.js';
import { PROVIDERS } from './integrations/index.js';
import { ProviderAuthError } from './integrations/questrade.js';
import { todayStr } from './portfolio.js';

const LOCK_MS = 2 * 60 * 1000;
const STALE_MS = 23 * 60 * 60 * 1000;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const MESSAGES = {
  needs_reauth: 'The institution rejected the saved key. Update the key to resume syncing.',
  error: 'Could not reach the institution. It will be retried automatically.',
};

async function apply(db, conn, remoteAccounts) {
  const accounts = db.collection('accounts');
  const transactions = db.collection('transactions');
  const positions = db.collection('positions');
  const userId = conn.userId;

  for (const remote of remoteAccounts) {
    const externalKey = createHash('sha256').update(`${conn._id}:${remote.id}`).digest('hex').slice(0, 32);
    let account = await accounts.findOne({ userId, connectionId: conn._id, externalKey });
    const isNew = !account;
    if (isNew) {
      account = {
        _id: randomUUID(), userId, name: remote.name, type: remote.type, groupId: null,
        connectionId: conn._id, externalKey, createdAt: new Date(),
      };
      await accounts.insertOne(account);
    }

    const existing = await transactions.find({ userId, accountId: account._id }).toArray();
    const current = existing.reduce((n, t) => n + t.amount, 0);
    const delta = round2(remote.balance - current);
    if (delta !== 0) {
      await transactions.insertOne({
        _id: randomUUID(), userId, accountId: account._id,
        type: isNew ? 'in' : 'gain', amount: delta, date: todayStr(),
        note: isNew ? 'Initial sync' : 'Synced value change', createdAt: new Date(),
      });
    }

    await accounts.updateOne({ _id: account._id, userId }, { $set: { cash: remote.cash, syncedAt: new Date() } });
    await positions.deleteMany({ userId, accountId: account._id });
    if (remote.positions.length) {
      await positions.insertMany(
        remote.positions.map((p) => ({ _id: randomUUID(), userId, accountId: account._id, ...p })),
      );
    }
  }
  return remoteAccounts.length;
}

// Returns { status: 'ok' | 'needs_reauth' | 'error' | 'busy', accounts }.
export async function syncConnection(conn) {
  const db = await getDb();
  const connections = db.collection('connections');
  const locked = await connections.updateOne(
    { _id: conn._id, lockUntil: { $lt: Date.now() } },
    { $set: { lockUntil: Date.now() + LOCK_MS } },
  );
  if (!locked.matchedCount) return { status: 'busy', accounts: 0 };

  let result;
  try {
    const provider = PROVIDERS[conn.provider];
    const { session, secret } = await provider.authenticate(decrypt(conn.secret));
    // The old token is now invalid, so persist the replacement before anything else.
    await connections.updateOne({ _id: conn._id }, { $set: { secret: encrypt(secret) } });
    const count = await apply(db, conn, await provider.fetchAccounts(session));
    await connections.updateOne(
      { _id: conn._id },
      { $set: { status: 'ok', lastError: null, lastSyncAt: new Date() } },
    );
    result = { status: 'ok', accounts: count };
  } catch (err) {
    const status = err instanceof ProviderAuthError ? 'needs_reauth' : 'error';
    if (status === 'error') console.error('sync failed:', err.message);
    await connections.updateOne({ _id: conn._id }, { $set: { status, lastError: MESSAGES[status] } });
    result = { status, accounts: 0 };
  } finally {
    await connections.updateOne({ _id: conn._id }, { $set: { lockUntil: 0 } }).catch(() => {});
  }
  return result;
}

// Syncs every healthy connection that has not been synced in about a day.
export async function syncDue({ budgetMs = 50000 } = {}) {
  const db = await getDb();
  const due = await db
    .collection('connections')
    .find({ lastSyncAt: { $lt: new Date(Date.now() - STALE_MS) } })
    .toArray();
  const started = Date.now();
  const summary = { due: due.length, ok: 0, failed: 0, skipped: 0 };
  for (const conn of due) {
    if (conn.status === 'needs_reauth' || Date.now() - started > budgetMs) {
      summary.skipped++;
      continue;
    }
    const r = await syncConnection(conn);
    if (r.status === 'ok') summary.ok++;
    else summary.failed++;
  }
  return summary;
}
