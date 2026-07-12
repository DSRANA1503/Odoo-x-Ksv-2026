import { useState, useEffect } from "react";
import StatusBadge from "../components/dashboard/StatusBadge";
import Loader from "../components/common/Loader";
import FilterDropdowns from "../components/dashboard/FilterDropdowns";
import RoleWrapper from "../components/rbac/RoleWrapper";
import VehicleModal from "../components/modals/VehicleModal";
import { vehicleService } from "../api/services";
import { Search, Plus, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Vehicle {
  _id: string;
  regNo: string;
  modelName: string;
  type: string;
  capacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region: string;
}

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await vehicleService.getAll();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.regNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (v.modelName && v.modelName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Vehicle Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your fleet, capacities, and current operational statuses.</p>
        </div>
        <RoleWrapper allowedRoles={["Fleet Manager", "Admin"]}>
          <button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto active:scale-95">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </RoleWrapper>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by Registration No or Model..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white dark:bg-gray-900"
            />
          </div>
          <FilterDropdowns 
            options={["Available", "On Trip", "In Shop", "Retired"]} 
            selected={statusFilter} 
            onChange={setStatusFilter} 
            label="Status:"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5">Reg No</th>
                <th className="px-6 py-5">Model & Type</th>
                <th className="px-6 py-5">Capacity (kg)</th>
                <th className="px-6 py-5">Odometer</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Region</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Loader />
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No vehicles found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredVehicles.map((v, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={v._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{v.regNo}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{v.modelName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{v.type}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{v.capacity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{v.odometer?.toLocaleString()} km</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={v.status} type="vehicle" />
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{v.region}</td>
                      <td className="px-6 py-4 text-right">
                        <RoleWrapper allowedRoles={["Fleet Manager", "Admin"]}>
                          <button onClick={() => handleEdit(v)} className="text-violet-600 hover:text-violet-800 p-2 rounded-lg hover:bg-violet-50 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </RoleWrapper>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <VehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedVehicle} 
        onSave={fetchVehicles} 
      />
    </motion.div>
  );
}
