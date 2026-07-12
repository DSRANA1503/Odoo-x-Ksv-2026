import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Phone, MapPin } from "lucide-react";

export default function DriverSummaryModal({ isOpen, onClose, driver }: any) {
  if (!isOpen || !driver) return null;

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
            <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-3xl uppercase shrink-0 shadow-sm">
                {driver.name.charAt(0)}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{driver.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">License: {driver.licenseNumber}</p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1"><Phone className="w-3 h-3"/> {driver.contactNumber}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Safety Score:</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> {driver.safetyScore}/100</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-gray-900 dark:text-white">{driver.status}</span>
             </div>
          </div>
          
          <button onClick={onClose} className="w-full mt-6 py-3 bg-[#17376e] hover:bg-[#122850] text-white font-semibold rounded-xl transition-colors">
            Close Summary
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
