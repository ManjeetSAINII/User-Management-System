type Variant = "success" | "warning" | "danger" | "info" | "purple" | "gray";

const variants: Record<Variant, string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = "gray", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function roleBadge(role: string) {
  const map: Record<string, Variant> = {
    ADMIN: "purple",
    MANAGER: "info",
    USER: "gray",
  };
  return map[role] || "gray";
}

export function statusBadge(status: string) {
  const map: Record<string, Variant> = {
    ACTIVE: "success",
    INACTIVE: "warning",
    SUSPENDED: "danger",
  };
  return map[status] || "gray";
}
