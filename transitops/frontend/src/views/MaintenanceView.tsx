import { useState, useEffect, useMemo } from "react";
import StatusBadge from "../components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";
import RoleWrapper from "../components/rbac/RoleWrapper";
import Loader from "../components/common/Loader";
import MaintenanceModal from "../components/modals/MaintenanceModal";
import { maintenanceService } from "../api/services";
import { Plus, CheckCircle2, Wrench, Search, Filter, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default function MaintenanceView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await maintenanceService.getAll();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await maintenanceService.complete(id);
      fetchLogs();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error completing maintenance");
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.vehicleId?.regNo?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter ? log.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  const exportData = () => {
    const headers = ["Vehicle", "Description", "Date", "Cost", "Status"];
    const data = filteredLogs.map(log => [
      log.vehicleId?.regNo || 'Unknown',
      log.description,
      new Date(log.date).toLocaleDateString(),
      log.cost,
      log.status
    ]);
    return { headers, data };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Maintenance & Shop</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Service logs and repair tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const { headers, data } = exportData(); exportToCSV(data, headers, "maintenance_logs"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export CSV">
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => { const { headers, data } = exportData(); exportToPDF(data, headers, "maintenance_logs", "Maintenance Logs"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export PDF">
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
          <RoleWrapper allowedRoles={["Fleet Manager", "Admin"]}>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#17376e] hover:bg-[#122850] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto active:scale-95 ml-2"> 
              <Plus className="w-4 h-4" /> Log Repair
            </button>
          </RoleWrapper>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search repairs by description or vehicle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Cost</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center"><Loader /></td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No logs found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredLogs.map((log, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={log._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                            <Wrench className="w-4 h-4" />
                          </div>
                          {log.vehicleId?.regNo || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px] truncate" title={log.description}>{log.description}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(log.date)}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(log.cost)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={log.status} type="maintenance" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RoleWrapper allowedRoles={["Fleet Manager", "Admin"]}>
                          {log.status === "In Progress" && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleComplete(log._id)} title="Complete" className="text-emerald-600 hover:text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors bg-emerald-50 active:scale-95">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
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
      
      <MaintenanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchLogs} />
    </motion.div>
  );
}
