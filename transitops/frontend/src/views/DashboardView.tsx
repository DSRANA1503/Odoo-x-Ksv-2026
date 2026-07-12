import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import KPICard from "../components/dashboard/KPICard";
import KPIModal from "../components/modals/KPIModal";
import { formatCurrency } from "../utils/formatters";
import { analyticsService } from "../api/services";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { 
  Truck, ShieldCheck, 
  Map, 
  Wrench, 
  Activity, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  TrendingUp, 
  PieChart,
  Filter
} from "lucide-react";

export default function DashboardView() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendDays, setTrendDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    region: "",
    type: "",
    status: ""
  });

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      
      const res = await analyticsService.getKPIs(queryParams.toString());
      setKpis(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, [filters]);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await analyticsService.getTripsTrend(trendDays);
        setChartData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.role === "Fleet Manager" || user?.role === "Admin" || user?.role === "Financial Analyst") {
      fetchTrend();
    }
  }, [trendDays, user?.role]);

  if (loading && !kpis) return <Loader />;

  let stats: any[] = [];
  
  if (user?.role === "Fleet Manager" || user?.role === "Admin") {
    stats = [
      { label: "Active Vehicles", value: kpis.activeVehicles, color: "text-[#17376e]", bg: "bg-blue-50", icon: Truck },
      { label: "Available", value: kpis.availableVehicles, color: "text-emerald-600", bg: "bg-emerald-100", icon: Truck },
      { label: "In Maintenance", value: kpis.vehiclesInMaintenance, color: "text-[#a70000]", bg: "bg-red-50", icon: Wrench },
      { label: "Utilization", value: `${kpis.fleetUtilization}%`, color: "text-[#17376e]", bg: "bg-blue-50", icon: Activity },
      { label: "Active Trips", value: kpis.activeTrips, color: "text-[#17376e]", bg: "bg-blue-50", icon: Map },
      { label: "Pending Trips", value: kpis.pendingTrips, color: "text-amber-600", bg: "bg-amber-100", icon: Map },
      { label: "Drivers On Duty", value: kpis.driversOnDuty, color: "text-emerald-600", bg: "bg-emerald-100", icon: Users },
      { label: "Drivers Off Duty", value: kpis.offDutyDrivers, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100", icon: Users }
    ];
  } else if (user?.role === "Safety Officer") {
    stats = [
      { label: "Avg Safety Score", value: kpis.averageSafetyScore, color: "text-[#17376e]", bg: "bg-blue-50", icon: ShieldCheck },
      { label: "Total Incidents", value: kpis.incidentCount, color: "text-[#a70000]", bg: "bg-red-50", icon: AlertTriangle },
      { label: "Suspended Drivers", value: kpis.suspendedDrivers, color: "text-[#a70000]", bg: "bg-red-50", icon: Users },
      { label: "Drivers On Duty", value: kpis.driversOnDuty, color: "text-emerald-600", bg: "bg-emerald-100", icon: Users },
      { label: "Drivers Off Duty", value: kpis.offDutyDrivers, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100", icon: Users }
    ];
  } else if (user?.role === "Financial Analyst") {
    stats = [
      { label: "Total Revenue (YTD)", value: formatCurrency(kpis.totalRevenue), color: "text-emerald-600", bg: "bg-emerald-100", icon: DollarSign },
      { label: "Total Expenses (YTD)", value: formatCurrency(kpis.totalExpenses), color: "text-[#a70000]", bg: "bg-red-50", icon: TrendingUp },
      { label: "Net Profit (YTD)", value: formatCurrency(kpis.netProfit), color: "text-[#17376e]", bg: "bg-blue-50", icon: PieChart },
      { label: "Utilization", value: `${kpis.fleetUtilization}%`, color: "text-[#17376e]", bg: "bg-blue-50", icon: Activity },
    ];
  } else if (user?.role === "Driver") {
    stats = [
      { label: "Active Trips", value: kpis.activeTrips, color: "text-[#17376e]", bg: "bg-blue-50", icon: Map },
      { label: "Pending Trips", value: kpis.pendingTrips, color: "text-amber-600", bg: "bg-amber-100", icon: Map },
      { label: "Safety Score", value: "98/100", color: "text-emerald-600", bg: "bg-emerald-100", icon: Activity }, 
    ];
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</span>. Here is your {user?.role} summary for today.</p>
        </div>
      </div>
      
      {(user?.role === "Fleet Manager" || user?.role === "Admin") && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          <select 
            value={filters.region} 
            onChange={(e) => setFilters({...filters, region: e.target.value})}
            className="border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="South America">South America</option>
          </select>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Types</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Medium Truck">Medium Truck</option>
            <option value="Light Van">Light Van</option>
          </select>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          
          {(filters.region || filters.type || filters.status) && (
            <button 
              onClick={() => setFilters({region: "", type: "", status: ""})}
              className="text-xs text-[#a70000] hover:underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <KPICard 
              label={stat.label} 
              value={stat.value} 
              color={stat.color} 
              bg={stat.bg} 
              icon={stat.icon}
              onClick={() => setSelectedKpi(stat)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/vehicles" className="flex flex-col items-center justify-center p-4 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 transition-colors border border-violet-100 dark:border-violet-800">
            <Truck className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Vehicles</span>
          </Link>
          <Link to="/drivers" className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition-colors border border-blue-100 dark:border-blue-800">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Drivers</span>
          </Link>
          <Link to="/trips" className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 transition-colors border border-emerald-100 dark:border-emerald-800">
            <Map className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Dispatch Trip</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 transition-colors border border-amber-100 dark:border-amber-800">
            <TrendingUp className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </Link>
        </div>
      </motion.div>

      {(user?.role === "Fleet Manager" || user?.role === "Admin" || user?.role === "Financial Analyst") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Trips Trend</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total trips dispatched.</p>
            </div>
            <select 
              value={trendDays} 
              onChange={e => setTrendDays(Number(e.target.value))}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#17376e]/20 focus:border-[#17376e] transition-all cursor-pointer w-full sm:w-auto"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17376e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#17376e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#17376e', fontWeight: 600 }}
                  cursor={{ stroke: '#17376e', strokeWidth: 2, strokeDasharray: '4 4', strokeOpacity: 0.3 }}
                />
                <Area type="monotone" dataKey="trips" stroke="#17376e" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <KPIModal isOpen={!!selectedKpi} onClose={() => setSelectedKpi(null)} kpi={selectedKpi} />
    </motion.div>
  );
}
