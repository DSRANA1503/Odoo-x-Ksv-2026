import { useState, useEffect } from "react";
import { driverService } from "../../api/services";

export default function DriverModal({ isOpen, onClose, driver, onSave }: any) {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiryDate: "",
    contactNumber: "",
    safetyScore: 100,
    status: "Available"
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        licenseExpiryDate: driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0] : ""
      });
    } else {
      setFormData({
        name: "", licenseNumber: "", licenseCategory: "", licenseExpiryDate: "", contactNumber: "", safetyScore: 100, status: "Available"
      });
    }
  }, [driver]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (driver) {
        await driverService.update(driver._id, formData);
      } else {
        await driverService.create(formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving driver");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{driver ? "Edit Driver" : "Add Driver"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">License Number</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">License Category</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">License Expiry</label>
              <input required type="date" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.licenseExpiryDate} onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Number</label>
              <input required type="text" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Safety Score</label>
              <input required type="number" min="0" max="100" className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.safetyScore} onChange={e => setFormData({...formData, safetyScore: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select className="w-full border rounded-xl-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
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
