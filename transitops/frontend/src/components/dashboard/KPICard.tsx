import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface KPICardProps {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function KPICard({ label, value, color, bg, icon: Icon, onClick }: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex items-start justify-between transition-all hover:shadow-xl hover:border-blue-100 cursor-pointer group"
    >
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:text-gray-100 transition-colors">{label}</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{value}</div>
      </div>
      {Icon && (
        <div className={`p-3 rounded-2xl ${bg || 'bg-gray-100'} ${color || 'text-gray-600 dark:text-gray-400'} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </motion.div>
  );
}
