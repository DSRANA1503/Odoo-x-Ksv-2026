import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Truck, 
  ShieldCheck, 
  Map, 
  Wrench, 
  CreditCard, 
  PieChart, 
  Settings,
  Hexagon,
  X,
  Users
} from "lucide-react";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { user } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst", "Admin"] },
    { name: "Vehicle Registry", path: "/vehicles", icon: Truck, roles: ["Fleet Manager", "Admin"] },
    { name: "Driver Safety", path: "/drivers", icon: ShieldCheck, roles: ["Fleet Manager", "Safety Officer", "Admin"] },
    { name: "Trip Dispatcher", path: "/trips", icon: Map, roles: ["Fleet Manager", "Driver", "Admin"] },
    { name: "Maintenance", path: "/maintenance", icon: Wrench, roles: ["Fleet Manager", "Admin"] },
    { name: "Fuel & Expenses", path: "/finance", icon: CreditCard, roles: ["Fleet Manager", "Financial Analyst", "Admin"] },
    { name: "Analytics", path: "/analytics", icon: PieChart, roles: ["Fleet Manager", "Financial Analyst", "Admin"] },
    { name: "Audit Logs", path: "/audit-logs", icon: Users, roles: ["Admin"] },
    { name: "Settings", path: "/settings", icon: Settings, roles: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst", "Admin"] },
  ];

  const sidebarContent = (
    <div className="w-64 bg-[#17376e] text-blue-100 flex flex-col h-full shrink-0 border-r border-[#122850] shadow-2xl">
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#1f4585] font-bold text-lg tracking-wide text-white">
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Hexagon className="w-6 h-6 text-white fill-white/20" />
          TRANSITOPS
        </Link>
        <button 
          className="md:hidden text-blue-300 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1.5 px-3">
          {navItems.filter(item => item.roles.includes(user?.role || "")).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? "bg-[#a70000] text-white font-medium shadow-sm" 
                        : "text-blue-200 hover:bg-[#1f4585] hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-[#1f4585]">
        <div className="bg-[#122850] rounded-lg p-4 text-xs border border-[#1f4585] hover:bg-[#0f2142] transition-colors cursor-default">
          <p className="text-blue-300 font-medium mb-1">Active Role</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-white font-semibold truncate mr-2">{user?.role}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-blue-300">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0f2142]/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
