"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, updateUserSchema, RegisterInput, UpdateUserInput } from "@/lib/validations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge, { roleBadge, statusBadge } from "@/components/ui/Badge";

type User = {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  role: string;
  status: string;
  createdAt: string;
};

type UserRole = "ADMIN" | "USER" | "MANAGER";

function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; id: string } | null>(null);
  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setCurrentUser(d));
  }, []);
  return currentUser;
}

export default function UsersPage() {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
      search,
      role: filterRole,
      status: filterStatus,
      sortBy,
      sortOrder,
    });
    const res = await fetch(`/api/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, search, filterRole, filterStatus, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function toggleSort(field: string) {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("asc"); }
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/users/${deleteUser.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteUser(null);
      fetchUsers();
    }
    setDeleteLoading(false);
  }

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{total} total users</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "mobile", label: "Mobile" },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                  { key: "createdAt", label: "Joined" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortBy === col.key && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </span>
                  </th>
                ))}
                {isAdmin && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 dark:text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-semibold text-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{user.mobile || "—"}</td>
                    <td className="px-4 py-4">
                      <Badge variant={roleBadge(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusBadge(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditUser(user)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => setDeleteUser(user)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <CreateUserModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onSuccess={() => { setCreateOpen(false); fetchUsers(); }}
          />
          {editUser && (
            <EditUserModal
              user={editUser}
              onClose={() => setEditUser(null)}
              onSuccess={() => { setEditUser(null); fetchUsers(); }}
            />
          )}
          <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete User" size="sm">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400">
                  Are you sure you want to delete <strong>{deleteUser?.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
                <Button variant="danger" loading={deleteLoading} onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

function CreateUserModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setServerError(json.error || "Failed to create user"); return; }
    reset();
    onSuccess();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create New User">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Mobile" placeholder="+1 555 000 0000" error={errors.mobile?.message} {...register("mobile")} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
        <Select
          label="Role"
          error={errors.role?.message}
          options={[
            { value: "USER", label: "User" },
            { value: "MANAGER", label: "Manager" },
            { value: "ADMIN", label: "Admin" },
          ]}
          {...register("role")}
        />
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create User</Button>
        </div>
      </form>
    </Modal>
  );
}

function EditUserModal({ user, onClose, onSuccess }: { user: User; onClose: () => void; onSuccess: () => void }) {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      role: user.role as "ADMIN" | "USER" | "MANAGER",
      status: user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    },
  });

  async function onSubmit(data: UpdateUserInput) {
    setServerError("");
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setServerError(json.error || "Failed to update user"); return; }
    onSuccess();
  }

  return (
    <Modal open onClose={onClose} title={`Edit ${user.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="Mobile" {...register("mobile")} />
        <Input label="New Password" type="password" placeholder="Leave blank to keep current" {...register("password")} />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Role"
            options={[
              { value: "USER", label: "User" },
              { value: "MANAGER", label: "Manager" },
              { value: "ADMIN", label: "Admin" },
            ]}
            {...register("role")}
          />
          <Select
            label="Status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
              { value: "SUSPENDED", label: "Suspended" },
            ]}
            {...register("status")}
          />
        </div>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
