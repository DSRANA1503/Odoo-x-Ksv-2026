import { useState, useEffect } from "react";
import { financeService, vehicleService, tripService } from "../../api/services";

export default function ExpenseModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ tripId: "", vehicleId: "", type: "Toll", amount: 0, description: "" });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      vehicleService.getAll().then(res => setVehicles(res.data));
      tripService.getAll().then(res => setTrips(res.data));
      setFormData({ tripId: "", vehicleId: "", type: "Toll", amount: 0, description: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await financeService.logExpense(formData);
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error logging expense");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Toll">Toll</option>
              <option value="Misc">Misc</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Vehicle (Required)</label>
            <select required className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNo}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Trip (Optional)</label>
            <select className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.tripId} onChange={e => setFormData({...formData, tripId: e.target.value})}>
              <option value="">None</option>
              {trips.map(t => <option key={t._id} value={t._id}>{t.origin} - {t.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Amount ($)</label>
            <input required type="number" min="0" step="0.01" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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
