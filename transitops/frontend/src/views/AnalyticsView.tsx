import { useState, useEffect } from "react";
import RoleWrapper from "../components/rbac/RoleWrapper";
import RevenueChart from "../components/charts/RevenueChart";
import Loader from "../components/common/Loader";
import { analyticsService } from "../api/services";
import { formatCurrency } from "../utils/formatters";
import { Download, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default function AnalyticsView() {
  const [vehiclesData, setVehiclesData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getVehicles();
        setVehiclesData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchChartData = async () => {
      try {
        const res = await analyticsService.getRevenueTrend();
        setChartData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchAnalytics();
    fetchChartData();
  }, []);

  const handleExportCSV = () => {
    if (!vehiclesData.length) return;
    const headers = ["Vehicle", "Model", "Distance (km)", "Fuel Efficiency (km/L)", "Revenue", "Op Cost", "ROI (%)"];
    const data = vehiclesData.map(v => [
      v.regNo,
      v.modelName,
      v.totalDistance || 0,
      v.fuelEfficiency,
      v.totalRevenue,
      v.totalOperationalCost,
      v.roi
    ]);
    exportToCSV(data, headers, "vehicle_performance_report");
  };

  const handleExportPDF = () => {
    if (!vehiclesData.length) return;
    const headers = ["Vehicle", "Model", "Distance (km)", "Fuel Efficiency (km/L)", "Revenue", "Op Cost", "ROI (%)"];
    const data = vehiclesData.map(v => [
      v.regNo,
      v.modelName,
      v.totalDistance || 0,
      v.fuelEfficiency,
      formatCurrency(v.totalRevenue),
      formatCurrency(v.totalOperationalCost),
      `${v.roi}%`
    ]);
    exportToPDF(data, headers, "vehicle_performance_report", "Vehicle Performance Breakdown");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fleet performance, Fuel Efficiency, and ROI metrics.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto active:scale-95"> 
            <Download className="w-4 h-4 text-[#17376e]" /> CSV
          </button>
          <button onClick={handleExportPDF} className="flex items-center justify-center gap-2 bg-[#17376e] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#122850] transition-colors shadow-sm w-full sm:w-auto active:scale-95"> 
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">Vehicle Performance Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold text-xs tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Distance (km)</th>
                <th className="px-6 py-5">Fuel Efficiency (km/L)</th>
                <th className="px-6 py-5">Revenue</th>
                <th className="px-6 py-5">Op Cost</th>
                <th className="px-6 py-5">ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center"><Loader /></td>
                </tr>
              ) : vehiclesData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No data available.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {vehiclesData.map((v, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={v.vehicleId} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{v.regNo} <span className="text-gray-400 text-xs ml-1">({v.modelName})</span></td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{v.totalDistance?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{v.fuelEfficiency}</td>
                      <td className="px-6 py-4 text-emerald-600 font-medium">{formatCurrency(v.totalRevenue)}</td>
                      <td className="px-6 py-4 text-rose-600 font-medium">{formatCurrency(v.totalOperationalCost)}</td>
                      <td className={`px-6 py-4 font-bold flex items-center gap-1.5 ${Number(v.roi) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {Number(v.roi) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {v.roi}%
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 mt-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 tracking-tight">Revenue vs Cost (YTD Trend)</h2>
        <RevenueChart data={chartData} />
      </motion.div>
    </motion.div>
  );
}
