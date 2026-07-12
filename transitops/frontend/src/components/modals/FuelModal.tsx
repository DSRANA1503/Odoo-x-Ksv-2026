import { useState, useEffect } from "react";
import { financeService, vehicleService } from "../../api/services";

export default function FuelModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ vehicleId: "", liters: 0, cost: 0 });
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      vehicleService.getAll().then(res => setVehicles(res.data));
      setFormData({ vehicleId: "", liters: 0, cost: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await financeService.logFuel(formData);
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error logging fuel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Log Fuel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Vehicle</label>
            <select required className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNo}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Liters</label>
            <input required type="number" min="0" step="0.01" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.liters} onChange={e => setFormData({...formData, liters: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Cost ($)</label>
            <input required type="number" min="0" step="0.01" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
