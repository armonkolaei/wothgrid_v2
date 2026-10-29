import { getDb, closeDb } from './db.js';

const db = await getDb();
await db.command({ ping: 1 });
console.log('Database connection OK.');
await closeDb();
