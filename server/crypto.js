import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// AES-256-GCM for secrets stored in the database (e.g. broker API tokens).
function key() {
  const k = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'base64');
  if (k.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  return k;
}

export function encrypt(plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64')).join('.');
}

export function decrypt(payload) {
  const [iv, tag, data] = String(payload).split('.').map((s) => Buffer.from(s, 'base64'));
  const decipher = createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
