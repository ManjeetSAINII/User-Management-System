interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "violet" | "green" | "blue" | "orange" | "red";
  description?: string;
}

const colors = {
  violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
  green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

export default function StatCard({ title, value, icon, color, description }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
