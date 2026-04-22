import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatCard from "@/components/ui/StatCard";
import Badge, { roleBadge, statusBadge } from "@/components/ui/Badge";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [totalUsers, activeUsers, admins, managers, recentUsers, recentAudit] =
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
      user.role === "ADMIN"
        ? db.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 8,
          })
        : Promise.resolve([]),
    ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name.split(" ")[0]}!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening in your system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          color="violet"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          color="green"
          description={`${totalUsers - activeUsers} inactive`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Admins"
          value={admins}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          title="Managers"
          value={managers}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-semibold text-sm flex-shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={roleBadge(u.role)}>{u.role}</Badge>
                  <Badge variant={statusBadge(u.status)}>{u.status}</Badge>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">No users yet</p>
            )}
          </div>
        </div>

        {user.role === "ADMIN" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentAudit.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    log.action === "CREATE" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                    log.action === "UPDATE" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                    log.action === "DELETE" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {log.action.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{log.details}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {log.performedBy} · {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentAudit.length === 0 && (
                <p className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">No activity yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
