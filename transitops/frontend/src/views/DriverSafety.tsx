import { useState, useEffect, useMemo } from "react";
import StatusBadge from "../components/dashboard/StatusBadge";
import Loader from "../components/common/Loader";
import RoleWrapper from "../components/rbac/RoleWrapper";
import DriverModal from "../components/modals/DriverModal";
import DriverSummaryModal from "../components/modals/DriverSummaryModal";
import { driverService } from "../api/services";
import { formatDate } from "../utils/formatters";
import { Plus, Edit2, ShieldAlert, Phone, Search, Filter, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface Driver {
  _id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: string;
}

export default function DriverSafety() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summaryDriver, setSummaryDriver] = useState<Driver | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await driverService.getAll();
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAdd = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const filteredDrivers = useMemo(() => {
    let result = drivers.filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter ? driver.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });

    return result;
  }, [drivers, searchQuery, statusFilter, sortOrder]);

  const exportData = () => {
    const headers = ["Name", "License No", "Category", "Expiry Date", "Contact", "Safety Score", "Status"];
    const data = filteredDrivers.map(d => [
      d.name, d.licenseNumber, d.licenseCategory, new Date(d.licenseExpiryDate).toLocaleDateString(), 
      d.contactNumber, `${d.safetyScore}/100`, d.status
    ]);
    return { headers, data };
  };

  if (loading && !drivers.length) return <Loader />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Driver Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor driver profiles, safety scores, and license validity.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const { headers, data } = exportData(); exportToCSV(data, headers, "driver_safety"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export CSV">
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => { const { headers, data } = exportData(); exportToPDF(data, headers, "driver_safety", "Driver Safety"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export PDF">
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
          <RoleWrapper allowedRoles={["Fleet Manager", "Safety Officer", "Admin"]}>
            <button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-[#17376e] hover:bg-[#122850] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto active:scale-95 ml-2">
              <Plus className="w-4 h-4" /> Add Driver
            </button>
          </RoleWrapper>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search drivers by name or license..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
          <Filter className="w-4 h-4 text-gray-400 ml-2" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No data found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDrivers.map((driver, idx) => {
            const isExpired = new Date(driver.licenseExpiryDate) < new Date();
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={driver._id} 
                onClick={() => { setSummaryDriver(driver); setIsSummaryOpen(true); }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative group hover:-translate-y-1 hover:shadow-xl hover:border-violet-200 cursor-pointer transition-all"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RoleWrapper allowedRoles={["Fleet Manager", "Safety Officer", "Admin"]}>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(driver); }} className="text-violet-600 hover:text-violet-800 p-2 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </RoleWrapper>
                </div>
                <div className="flex items-start gap-4 mb-4 pr-10">
                  <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xl uppercase shrink-0">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{driver.name}</h3>
                    <div className="mt-1">
                      <StatusBadge status={driver.status} type="driver" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mt-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Safety Score:</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${driver.safetyScore >= 90 ? 'bg-green-100 text-green-700' : driver.safetyScore >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {driver.safetyScore < 75 && <ShieldAlert className="w-3 h-3" />}
                      {driver.safetyScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">License:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{driver.licenseNumber} <span className="text-gray-400">({driver.licenseCategory})</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Expiry:</span>
                    <span className={`font-medium ${isExpired ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded' : 'text-gray-900 dark:text-gray-100'}`}>
                      {formatDate(driver.licenseExpiryDate)} {isExpired && " (Expired)"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {driver.contactNumber}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      )}

      <DriverModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        driver={selectedDriver} 
        onSave={fetchDrivers} 
      />

      <DriverSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        driver={summaryDriver}
      />
    </motion.div>
  );
}
