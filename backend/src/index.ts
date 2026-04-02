import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB, disconnectDB } from './config/database';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 LibroStore API v1 — ${process.env.NODE_ENV || 'development'}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
