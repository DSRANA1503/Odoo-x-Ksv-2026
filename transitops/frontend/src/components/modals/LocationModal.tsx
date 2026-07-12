import { motion, AnimatePresence } from "motion/react";
import { X, MapPin } from "lucide-react";

export default function LocationModal({ isOpen, onClose, location }: any) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#a70000] dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Current Location</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-900 h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7CNew+York,NY&key=YOUR_API_KEY_HERE')] bg-cover bg-center opacity-50 dark:opacity-30 grayscale blur-[1px]"></div>
            
            <div className="relative z-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center gap-3 border border-gray-100 dark:border-gray-700 max-w-sm w-full text-center flex-col">
               <MapPin className="w-8 h-8 text-[#a70000] dark:text-red-400" />
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{location}</p>
                  <p className="text-xs text-gray-500 mt-1">Live Tracking Enabled</p>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
