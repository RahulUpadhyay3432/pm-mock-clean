import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}

function getPrismaClient(): PrismaClient {
  if (typeof globalThis === 'undefined') {
    return createPrismaClient();
  }

  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient();
  }

  return globalThis.__prisma;
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}