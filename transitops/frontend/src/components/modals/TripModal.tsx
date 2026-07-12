import { useState, useEffect } from "react";
import { tripService, vehicleService, driverService } from "../../api/services";

export default function TripModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    cargoWeight: 0,
    plannedDistance: 0,
    origin: "",
    destination: ""
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      vehicleService.getAll().then(res => setVehicles(res.data.filter((v: any) => v.status === "Available")));
      driverService.getAll().then(res => setDrivers(res.data.filter((d: any) => d.status === "Available" && new Date(d.licenseExpiryDate) > new Date())));
      setFormData({
        vehicleId: "", driverId: "", cargoWeight: 0, plannedDistance: 0, origin: "", destination: ""
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await tripService.create(formData);
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating trip");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Create Trip (Draft)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Origin</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Destination</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Vehicle</label>
              <select required className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
                <option value="">Select Available Vehicle</option>
                {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNo} ({v.capacity}kg max)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Driver</label>
              <select required className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})}>
                <option value="">Select Available Driver</option>
                {drivers.map(d => <option key={d._id} value={d._id}>{d.name} ({d.licenseCategory})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Cargo Weight (kg)</label>
              <input required type="number" min="1" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.cargoWeight} onChange={e => setFormData({...formData, cargoWeight: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Planned Distance (km)</label>
              <input required type="number" min="1" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}
