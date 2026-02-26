# Backend (Express + Prisma)

This directory contains the Express server and Prisma ORM setup.

## Setup

```bash
cd backend
npm install
# ensure DATABASE_URL in .env is correct for MySQL (xamp or wamp)
npx prisma db push
npm run dev
```

`DATABASE_URL` should be configured in `.env` (example: `mysql://user:password@localhost:3306/libro`).
