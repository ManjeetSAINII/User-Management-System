import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/app/generated/prisma/client";

const dbUrl = (process.env.DATABASE_URL ?? "").trim();
const dbToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim() || undefined;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL is required. Add your Turso/libSQL DATABASE_URL to the Vercel project environment variables."
  );
}

const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: dbToken,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma || new PrismaClient({ adapter } as never);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
