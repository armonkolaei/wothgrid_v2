import { MongoClient } from 'mongodb';

let clientPromise;

function client() {
  if (!clientPromise) {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
    clientPromise = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    }).connect();
    clientPromise.catch(() => (clientPromise = undefined));
  }
  return clientPromise;
}

export async function getDb() {
  return (await client()).db(process.env.MONGODB_DB || 'worthgrid-db');
}

export async function closeDb() {
  if (clientPromise) await (await clientPromise).close();
}
