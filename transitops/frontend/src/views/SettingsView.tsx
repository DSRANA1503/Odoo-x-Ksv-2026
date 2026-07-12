import { useAuth } from "../context/AuthContext";

export default function SettingsView() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile and platform preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-4">Profile Information</h2>
        
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center">
            
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{user?.name || "System Admin"}</div>
            <div className="text-gray-500 dark:text-gray-400">{user?.email || "admin@transitops.com"}</div>
            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full mt-2">
              Role: {user?.role || "Fleet Manager"}
            </span>
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
