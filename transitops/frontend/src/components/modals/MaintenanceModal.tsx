import { useState, useEffect } from "react";
import { maintenanceService, vehicleService } from "../../api/services";

export default function MaintenanceModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    description: "",
    cost: 0
  });
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      vehicleService.getAll().then(res => setVehicles(res.data));
      setFormData({ vehicleId: "", description: "", cost: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await maintenanceService.create(formData);
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error logging maintenance");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Log Maintenance Repair</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Vehicle</label>
            <select required className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNo} ({v.status})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Estimated Cost ($)</label>
            <input required type="number" min="0" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} />
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
