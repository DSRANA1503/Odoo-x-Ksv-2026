import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Search, Bell, LogOut, User, Menu, Clock, MapPin, Settings, Sun, Moon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import LocationModal from "../modals/LocationModal";
import axiosClient from "../../api/axiosClient";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, setTheme, theme } = useTheme();
  
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string>("Detecting...");
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{drivers: any[], vehicles: any[]}>({drivers: [], vehicles: []});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await axiosClient.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await axiosClient.put("/notifications/read");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchSearch = async () => {
        setSearchLoading(true);
        try {
          const res = await axiosClient.get(`/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setIsSearchOpen(true);
        } catch (err) {
          console.error(err);
        } finally {
          setSearchLoading(false);
        }
      };
      const timeoutId = setTimeout(fetchSearch, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setIsSearchOpen(false);
      setSearchResults({drivers: [], vehicles: []});
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          setCurrentLocation("Location unavailable");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex relative" ref={searchRef}>
          <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 w-64 md:w-80 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-[#17376e]/20 focus-within:border-[#17376e] dark:focus-within:border-blue-400 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search drivers or vehicles..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
            />
            {searchLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50 max-h-96 overflow-y-auto"
              >
                {searchResults.drivers?.length > 0 && (
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase px-3 py-1">Drivers</h4>
                    {searchResults.drivers.map((d, i) => (
                      <Link 
                        to="/drivers"
                        key={i} 
                        onClick={() => {setIsSearchOpen(false); setSearchQuery("");}}
                        className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <p className="text-sm font-medium dark:text-white">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.licenseNumber}</p>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.vehicles?.length > 0 && (
                  <div className="p-2 border-t border-gray-50 dark:border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase px-3 py-1">Vehicles</h4>
                    {searchResults.vehicles.map((v, i) => (
                      <Link 
                        to="/vehicles"
                        key={i} 
                        onClick={() => {setIsSearchOpen(false); setSearchQuery("");}}
                        className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <p className="text-sm font-medium dark:text-white">{v.regNo}</p>
                        <p className="text-xs text-gray-500">{v.modelName}</p>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.drivers?.length === 0 && searchResults.vehicles?.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Time and Location after Search */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ml-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#17376e] dark:text-blue-400" />
            {currentTime}
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsLocationOpen(true)}
          >
            <MapPin className="w-4 h-4 text-[#a70000] dark:text-red-400" />
            {currentLocation}
          </div>
        </div>
        
        <button 
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsLocationOpen(true)}
        >
          <MapPin className="w-5 h-5 text-[#a70000]" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#a70000] rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            )}
          </button>
          
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 max-w-[90vw] sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Notifications
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="bg-[#17376e] text-white text-[10px] px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    )}
                  </h3>
                  <span onClick={markAllAsRead} className="text-xs text-[#17376e] dark:text-blue-400 font-medium cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={`p-3 rounded-lg cursor-default transition-colors mb-1 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <p className={`text-sm font-medium ${!n.read ? 'text-[#17376e] dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-gray-200 dark:border-gray-700">
          <div className="relative" ref={profileRef}>
            <div 
              className="flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="h-9 w-9 rounded-full bg-[#17376e]/10 dark:bg-[#17376e]/30 text-[#17376e] dark:text-blue-300 flex items-center justify-center font-semibold border border-[#17376e]/20 group-hover:bg-[#17376e]/20 transition-colors">
                {user?.name?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none group-hover:text-[#17376e] dark:group-hover:text-blue-300 transition-colors">{user?.name || "User"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-none">{user?.role || "Role"}</div>
              </div>
            </div>
            
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50 py-1"
                >
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 lg:hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-50 dark:border-gray-800 my-1"></div>
                  <button 
                    onClick={logout} 
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#a70000] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} location={currentLocation} />
    </header>
  );
}
