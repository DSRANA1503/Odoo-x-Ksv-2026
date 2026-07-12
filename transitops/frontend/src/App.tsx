/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import DashboardView from "./views/DashboardView";
import VehicleRegistry from "./views/VehicleRegistry";
import DriverSafety from "./views/DriverSafety";
import TripDispatcher from "./views/TripDispatcher";
import MaintenanceView from "./views/MaintenanceView";
import FuelExpenseView from "./views/FuelExpenseView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import AuditLogsView from "./views/AuditLogsView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "motion/react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/vehicles" element={<VehicleRegistry />} />
                <Route path="/drivers" element={<DriverSafety />} />
                <Route path="/trips" element={<TripDispatcher />} />
                <Route path="/maintenance" element={<MaintenanceView />} />
                <Route path="/finance" element={<FuelExpenseView />} />
                <Route path="/analytics" element={<AnalyticsView />} />
                <Route path="/audit-logs" element={<AuditLogsView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
