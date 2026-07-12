import { useState, useEffect, useMemo } from "react";
import StatusBadge from "../components/dashboard/StatusBadge";
import Loader from "../components/common/Loader";
import RoleWrapper from "../components/rbac/RoleWrapper";
import TripModal from "../components/modals/TripModal";
import CompleteTripModal from "../components/modals/CompleteTripModal";
import { tripService } from "../api/services";
import { Plus, Navigation2, CheckCircle2, XCircle, Search, Filter, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default function TripDispatcher() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripService.getAll();
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAction = async (id: string, action: 'dispatch' | 'complete' | 'cancel') => {
    try {
      if (action === 'dispatch') {
        await tripService.dispatch(id);
        fetchTrips();
      } else if (action === 'complete') {
        setSelectedTripId(id);
        setCompleteModalOpen(true);
      } else if (action === 'cancel') {
        await tripService.cancel(id);
        fetchTrips();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || `Error during ${action}`);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) || 
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.vehicleId?.regNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driverId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter ? trip.lifecycleState === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  const exportData = () => {
    const headers = ["Route", "Vehicle", "Driver", "Cargo (kg)", "Distance (km)", "Status"];
    const data = filteredTrips.map(trip => [
      `${trip.origin} -> ${trip.destination}`,
      trip.vehicleId?.regNo || 'Unknown',
      trip.driverId?.name || 'Unknown',
      trip.cargoWeight || 0,
      trip.plannedDistance || 0,
      trip.lifecycleState
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
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Trip Dispatcher</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live board and dispatch form.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const { headers, data } = exportData(); exportToCSV(data, headers, "trip_dispatcher"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export CSV">
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => { const { headers, data } = exportData(); exportToPDF(data, headers, "trip_dispatcher", "Trip Dispatcher"); }} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" title="Export PDF">
            <FileText className="w-4 h-4 text-gray-500" />
          </button>
          <RoleWrapper allowedRoles={["Fleet Manager", "Driver", "Admin"]}>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#17376e] hover:bg-[#122850] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto active:scale-95 ml-2">
              <Plus className="w-4 h-4" /> Create Trip
            </button>
          </RoleWrapper>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips..." 
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
            <option value="Draft">Draft</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5">Route</th>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Driver</th>
                <th className="px-6 py-5">Cargo (kg)</th>
                <th className="px-6 py-5">Distance (km)</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center"><Loader /></td>
                </tr>
              ) : filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No trips found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredTrips.map((trip, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={trip._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          {trip.origin} <span className="text-gray-300">&rarr;</span> {trip.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.vehicleId?.regNo || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.driverId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.cargoWeight?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.plannedDistance?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={trip.lifecycleState} type="trip" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RoleWrapper allowedRoles={["Fleet Manager", "Driver", "Admin"]}>
                          <div className="flex justify-end gap-2">
                            {trip.lifecycleState === 'Draft' && (
                              <button onClick={() => handleAction(trip._id, 'dispatch')} title="Dispatch" className="text-[#17376e] hover:text-white p-2 rounded-lg hover:bg-[#17376e] transition-colors bg-blue-50 active:scale-95">
                                <Navigation2 className="w-4 h-4" />
                              </button>
                            )}
                            {trip.lifecycleState === 'Dispatched' && (
                              <button onClick={() => handleAction(trip._id, 'complete')} title="Complete" className="text-emerald-600 hover:text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors bg-emerald-50 active:scale-95">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {(trip.lifecycleState === 'Draft' || trip.lifecycleState === 'Dispatched') && (
                              <button onClick={() => handleAction(trip._id, 'cancel')} title="Cancel" className="text-[#a70000] hover:text-white p-2 rounded-lg hover:bg-[#a70000] transition-colors bg-red-50 active:scale-95">
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
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
      
      <TripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchTrips} />
      <CompleteTripModal isOpen={completeModalOpen} onClose={() => setCompleteModalOpen(false)} onSave={fetchTrips} tripId={selectedTripId} />
    </motion.div>
  );
}
