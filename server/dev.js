import { createApp } from './app.js';

import { syncDue } from './sync.js';

createApp().listen(3001, '127.0.0.1', () => console.log('API on http://localhost:3001'));

// Local stand-in for the Vercel cron: sync anything older than a day, checked hourly.
setInterval(() => syncDue().catch((e) => console.error('auto-sync failed:', e.message)), 60 * 60 * 1000).unref();
