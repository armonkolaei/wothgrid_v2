import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from './db.js';

const COOKIE = 'session';
const SESSION_SECONDS = 60 * 60 * 8;
const isProd = process.env.NODE_ENV === 'production';

// Compared against when the email doesn't exist, to equalise response timing.
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser', 12);

const emailField = z.string().trim().toLowerCase().email('Enter a valid email address').max(200);

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1).max(128),
});

const signupSchema = z.object({
  email: emailField,
  name: z.string().trim().min(1, 'Enter your name').max(100),
  password: z.string().min(12, 'Password must be at least 12 characters').max(128),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms of Service and Privacy Policy' }) }),
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  product: z.enum(['', 'family', 'advisor', 'whitelabel', 'api']).default(''),
  message: z.string().trim().min(1).max(2000),
});

const publicUser = (u) => ({ email: u.email, name: u.name });

function startSession(res, user) {
  const token = jwt.sign({ sub: String(user._id), email: user.email, name: user.name }, secret(), {
    algorithm: 'HS256',
    expiresIn: SESSION_SECONDS,
  });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: SESSION_SECONDS * 1000,
    path: '/',
  });
}

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET must be set (32+ chars)');
  return s;
}

function requireAuth(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies[COOKIE], secret(), { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Reject cross-site form posts: state-changing requests must be JSON.
function requireJson(req, res, next) {
  if (req.method !== 'GET' && !req.is('application/json')) {
    return res.status(415).json({ error: 'Unsupported media type' });
  }
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use('/api', requireJson);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts, try again later' },
  });

  app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials' });
      const { email, password } = parsed.data;

      // The schema guarantees a plain string, so no NoSQL operator injection.
      const db = await getDb();
      const user = await db.collection('users').findOne({ _id: email });
      const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !ok) return res.status(401).json({ error: 'Invalid credentials' });

      startSession(res, user);
      res.json(publicUser(user));
    } catch (err) {
      next(err);
    }
  });

  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many sign-ups, try again later' },
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many messages, try again later' },
  });

  app.post('/api/auth/signup', signupLimiter, async (req, res, next) => {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
      const { email, name, password } = parsed.data;

      const users = (await getDb()).collection('users');
      const passwordHash = await bcrypt.hash(password, 12);
      const user = { _id: email, email, name, passwordHash, termsAcceptedAt: new Date(), createdAt: new Date() };
      try {
        // _id is the unique email, so a concurrent duplicate is rejected by the database.
        await users.insertOne(user);
      } catch (err) {
        if (err?.code === 11000 || /already exists|duplicate/i.test(err?.message ?? '')) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }
        throw err;
      }
      startSession(res, user);
      res.status(201).json(publicUser(user));
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/contact', contactLimiter, async (req, res, next) => {
    try {
      const parsed = contactSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Please fill in all fields with a valid email.' });
      await (await getDb()).collection('contact_messages').insertOne({
        ...parsed.data,
        createdAt: new Date(),
      });
      res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie(COOKIE, { path: '/' });
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ email: req.user.email, name: req.user.name });
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // Never leak internals to the client.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
