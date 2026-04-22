"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserInput } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge, { roleBadge, statusBadge } from "@/components/ui/Badge";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  role: string;
  status: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        reset({
          name: data.name,
          email: data.email,
          mobile: data.mobile || "",
        });
      });
  }, [reset]);

  async function onSubmit(data: UpdateUserInput) {
    setServerError("");
    setSuccess(false);
    if (!user) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setServerError(json.error || "Update failed"); return; }
    setUser(json);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="w-24 h-24 rounded-2xl bg-violet-600 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex gap-2 mb-2">
              <Badge variant={roleBadge(user.role)}>{user.role}</Badge>
              <Badge variant={statusBadge(user.status)}>{user.status}</Badge>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Edit Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          </div>
          <Input label="Mobile Number" placeholder="+1 555 000 0000" {...register("mobile")} />
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Password</h4>
            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully!</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
