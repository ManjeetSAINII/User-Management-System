import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [totalUsers, activeUsers, admins, managers, recentUsers] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: "ACTIVE" } }),
      db.user.count({ where: { role: "ADMIN" } }),
      db.user.count({ where: { role: "MANAGER" } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  return NextResponse.json({
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    admins,
    managers,
    regularUsers: totalUsers - admins - managers,
    recentUsers,
  });
}
