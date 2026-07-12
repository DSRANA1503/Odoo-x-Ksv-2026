import { useState, useEffect } from "react";
import { vehicleService } from "../../api/services";

export default function VehicleModal({ isOpen, onClose, vehicle, onSave }: any) {
  const [activeTab, setActiveTab] = useState("Info");
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    regNo: "",
    modelName: "",
    type: "",
    capacity: 0,
    odometer: 0,
    acquisitionCost: 0,
    status: "Available",
    region: ""
  });

  const [docData, setDocData] = useState({
    docType: "Registration",
    expiryDate: "",
    file: null as File | null
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
      fetchDocuments(vehicle._id);
    } else {
      setFormData({
        regNo: "", modelName: "", type: "", capacity: 0, odometer: 0, acquisitionCost: 0, status: "Available", region: ""
      });
      setDocuments([]);
    }
  }, [vehicle]);

  const fetchDocuments = async (id: string) => {
    try {
      const res = await vehicleService.getDocuments(id);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (vehicle) {
        await vehicleService.update(vehicle._id, formData);
      } else {
        await vehicleService.create(formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving vehicle");
    }
  };

  const handleDocSubmit = async (e: any) => {
    e.preventDefault();
    if (!docData.file) {
      alert("Please select a file");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("docType", docData.docType);
    fd.append("expiryDate", docData.expiryDate);
    fd.append("file", docData.file);

    try {
      await vehicleService.uploadDocument(vehicle._id, fd);
      await fetchDocuments(vehicle._id);
      setDocData({ docType: "Registration", expiryDate: "", file: null });
    } catch (err: any) {
      alert(err.response?.data?.message || "Error uploading document");
    } finally {
      setUploading(false);
    }
  };

  const isExpiringSoon = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    return expiry < in30Days;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{vehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
        
        {vehicle && (
          <div className="flex gap-4 border-b dark:border-gray-800 mb-4">
            <button 
              className={`pb-2 ${activeTab === 'Info' ? 'border-b-2 border-violet-600 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('Info')}
            >
              Info
            </button>
            <button 
              className={`pb-2 ${activeTab === 'Documents' ? 'border-b-2 border-violet-600 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('Documents')}
            >
              Documents
            </button>
          </div>
        )}

        {activeTab === 'Info' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Reg No</label>
                <input required type="text" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Model Name</label>
                <input required type="text" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.modelName} onChange={e => setFormData({...formData, modelName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <input required type="text" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Capacity (kg)</label>
                <input required type="number" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Odometer</label>
                <input required type="number" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.odometer} onChange={e => setFormData({...formData, odometer: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Acquisition Cost</label>
                <input required type="number" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.acquisitionCost} onChange={e => setFormData({...formData, acquisitionCost: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Region</label>
                <input required type="text" className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select className="w-full border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="In Shop">In Shop</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">Save</button>
            </div>
          </form>
        )}

        {activeTab === 'Documents' && vehicle && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <h3 className="font-semibold mb-3">Upload New Document</h3>
              <form onSubmit={handleDocSubmit} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select required className="w-full border dark:border-gray-700 rounded-xl p-2 bg-white dark:bg-gray-900" value={docData.docType} onChange={e => setDocData({...docData, docType: e.target.value})}>
                    <option value="Registration">Registration</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Permit">Permit</option>
                    <option value="PUC">PUC</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                  <input required type="date" className="w-full border dark:border-gray-700 rounded-xl p-2 bg-white dark:bg-gray-900" value={docData.expiryDate} onChange={e => setDocData({...docData, expiryDate: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">File</label>
                  <input required type="file" className="w-full text-sm" onChange={e => setDocData({...docData, file: e.target.files?.[0] || null})} />
                </div>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-violet-600 text-white rounded-xl shadow-sm hover:shadow-md h-10 flex items-center">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Document List</h3>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents found.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc._id} className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-xl">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {doc.docType}
                          {isExpiringSoon(doc.expiryDate) && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Expiring Soon / Expired</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <a href={import.meta.env.VITE_API_URL + doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline text-sm font-medium">View File</a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
