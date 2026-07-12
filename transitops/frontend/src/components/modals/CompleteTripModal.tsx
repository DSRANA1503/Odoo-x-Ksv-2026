import { useState } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";
import { tripService } from "../../api/services";

export default function CompleteTripModal({ 
  isOpen, 
  onClose, 
  onSave, 
  tripId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: () => void;
  tripId: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [actualDistance, setActualDistance] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [revenue, setRevenue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) return;
    try {
      setLoading(true);
      await tripService.complete(tripId, { 
        actualDistance: Number(actualDistance),
        fuelConsumed: Number(fuelConsumed),
        revenue: Number(revenue)
      });
      onSave();
      onClose();
      // Reset
      setActualDistance("");
      setFuelConsumed("");
      setRevenue("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Trip details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Actual Distance (km)</label>
          <input
            type="number"
            required
            min="0"
            value={actualDistance}
            onChange={(e) => setActualDistance(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#17376e] focus:border-[#17376e] sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fuel Consumed (Liters)</label>
          <input
            type="number"
            required
            min="0"
            value={fuelConsumed}
            onChange={(e) => setFuelConsumed(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#17376e] focus:border-[#17376e] sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Earned ($)</label>
          <input
            type="number"
            required
            min="0"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#17376e] focus:border-[#17376e] sm:text-sm"
          />
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 focus:outline-none transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="inline-flex justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#17376e] hover:bg-[#122850] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17376e] disabled:opacity-70 transition-colors">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Trip"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
