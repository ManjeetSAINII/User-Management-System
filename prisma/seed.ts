import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = new PrismaClient({ adapter } as never);

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      mobile: "+1 555 000 0001",
    },
  });

  await db.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      name: "Sarah Manager",
      email: "manager@example.com",
      password: userPassword,
      role: "MANAGER",
      status: "ACTIVE",
      mobile: "+1 555 000 0002",
    },
  });

  const demoUsers = [
    { name: "Alice Johnson", email: "alice@example.com", mobile: "+1 555 100 0001" },
    { name: "Bob Smith", email: "bob@example.com", mobile: "+1 555 100 0002" },
    { name: "Charlie Brown", email: "charlie@example.com", mobile: "+1 555 100 0003" },
    { name: "Diana Prince", email: "diana@example.com", mobile: "+1 555 100 0004" },
    { name: "Ethan Hunt", email: "ethan@example.com", mobile: "+1 555 100 0005" },
  ];

  for (const u of demoUsers) {
    await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: userPassword, role: "USER", status: "ACTIVE" },
    });
  }

  await db.auditLog.create({
    data: {
      action: "CREATE",
      entity: "User",
      entityId: admin.id,
      details: "Database seeded with demo data",
      performedBy: "system",
    },
  });

  console.log("\nDatabase seeded successfully!");
  console.log("\nDemo credentials:");
  console.log("  Admin:   admin@example.com  / admin123");
  console.log("  Manager: manager@example.com / user123");
  console.log("  User:    alice@example.com   / user123");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
