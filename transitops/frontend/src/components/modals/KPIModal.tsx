import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, Info } from "lucide-react";

export default function KPIModal({ isOpen, onClose, kpi }: any) {
  if (!isOpen || !kpi) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-8 h-8" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{kpi.value}</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">{kpi.label}</p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Info className="w-4 h-4 text-blue-500" /> Insight
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This metric indicates the current status of {kpi.label.toLowerCase()}. Maintain tracking regularly to ensure operational efficiency. 
              {kpi.value.toString().includes('%') ? ' Consider strategies to optimize this percentage further.' : ' The numbers are consistent with the weekly average.'}
            </p>
          </div>
          
          <button onClick={onClose} className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors">
            Close Summary
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
