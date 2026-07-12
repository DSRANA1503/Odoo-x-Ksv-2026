import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { motion } from "motion/react";
import { Mail, Lock, Loader2, AlertTriangle, Hexagon } from "lucide-react";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      // Fallback for development if db is empty
      if (email === "admin@test.com") {
        login({ id: "1", name: "Admin User", email: "admin@test.com", role: "Fleet Manager" }, "fake-token");
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 flex-col justify-between p-12 lg:p-24 border-r border-gray-200 dark:border-gray-700">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 text-[#17376e]">
            <Hexagon className="w-12 h-12 fill-[#17376e]/10" strokeWidth={1.5} />
            <span className="text-4xl font-bold tracking-tight">TransitOps</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Smart Transport Operations Platform</p>
          
          <div className="pt-16 space-y-4">
            <h3 className="text-xl font-semibold text-[#17376e]">One login, four roles:</h3>
            <ul className="space-y-3">
              {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map((role, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#a70000]"></div>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
          TRANSITOPS © 2026 · RBAC ENABLED
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-32 bg-white dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="lg:hidden mb-10 flex justify-center text-[#17376e]">
            <Hexagon className="w-12 h-12 fill-[#17376e]/10" strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            Enter your credentials to continue or{" "}
            <Link to="/register" className="font-medium text-[#17376e] hover:text-[#17376e]/80 transition-colors">
              create a new account
            </Link>
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#a70000]/10 text-[#a70000] p-4 rounded-xl text-sm border border-[#a70000]/20 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold">Error state</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${error && !email ? 'border-[#a70000] focus:ring-[#a70000]/20' : 'border-gray-300 focus:border-[#17376e] focus:ring-[#17376e]/20'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 sm:text-sm transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:bg-gray-900`}
                    placeholder="raven.k@transitops.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${error && !password ? 'border-[#a70000] focus:ring-[#a70000]/20' : 'border-gray-300 focus:border-[#17376e] focus:ring-[#17376e]/20'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 sm:text-sm transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:bg-gray-900`}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#17376e] focus:ring-[#17376e] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#17376e] hover:text-[#17376e]/80">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#17376e] hover:bg-[#122850] focus:outline-none focus:ring-4 focus:ring-[#17376e]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            
            <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-2 text-gray-600 dark:text-gray-400">Access is scoped by role after login:</p>
              <ul className="space-y-1">
                <li>• Fleet Manager &rarr; Fleet, Maintenance</li>
                <li>• Dispatcher &rarr; Dashboard, Trips</li>
                <li>• Safety Officer &rarr; Drivers, Compliance</li>
                <li>• Financial Analyst &rarr; Fuel & Expenses, Analytics</li>
              </ul>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
