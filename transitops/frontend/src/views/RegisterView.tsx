import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/services";
import { motion } from "motion/react";
import { Mail, Lock, User, Loader2, AlertTriangle, ShieldCheck, Hexagon } from "lucide-react";

export default function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full Name is required");
      return;
    }
    
    if (name.trim().length < 3) {
      setError("Full Name must be at least 3 characters long");
      return;
    }
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    
    // Strong password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/(?=.*\d)/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError("Password must contain at least one special character (!@#$%^&*)");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({ name, email, password, role });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.message).join(", "));
      } else {
        setError(err.response?.data?.message || "Registration failed. Please check your input.");
      }
    } finally {
      setLoading(false);
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
              {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map((r, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#a70000]"></div>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
          TRANSITOPS © 2026 · RBAC ENABLED
        </div>
      </div>

      {/* Right Pane - Register Form */}
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
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#17376e] hover:text-[#17376e]/80 transition-colors">
              Sign in instead
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleRegister}>
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
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${error && !name ? 'border-[#a70000] focus:ring-[#a70000]/20' : 'border-gray-300 focus:border-[#17376e] focus:ring-[#17376e]/20'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 sm:text-sm transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:bg-gray-900`}
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    placeholder="you@example.com"
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
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#17376e]/20 focus:border-[#17376e] sm:text-sm rounded-xl cursor-pointer shadow-sm transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:bg-gray-900"
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Driver">Driver</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#17376e] hover:bg-[#122850] focus:outline-none focus:ring-4 focus:ring-[#17376e]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
