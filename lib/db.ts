import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/app/generated/prisma/client";

const dbUrl = (process.env.DATABASE_URL ?? "").trim();
const dbToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim() || undefined;

console.log("[db] URL prefix:", dbUrl.substring(0, 50));
console.log("[db] Token present:", !!dbToken);

const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: dbToken,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma || new PrismaClient({ adapter } as never);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
