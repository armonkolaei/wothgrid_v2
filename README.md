# wothgrid_v2
Wealth Tracker

## Setup
1. cp .env.example .env and fill in MONGODB_URI and JWT_SECRET
2. npm install; npm run db:init (connection check)
3. npm run dev (web: http://localhost:5173, api: :3001)

## Deploy
Import into Vercel, set MONGODB_URI and JWT_SECRET env vars. /api/* is served by api/index.js (Express); the React build is served statically.


