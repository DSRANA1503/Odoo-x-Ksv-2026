import re
import os

files = [
    "transitops/frontend/src/components/common/Sidebar.tsx",
    "transitops/frontend/src/components/common/Navbar.tsx",
    "transitops/frontend/src/components/common/Modal.tsx",
    "transitops/frontend/src/components/common/Alerts.tsx",
    "transitops/frontend/src/components/dashboard/KPICard.tsx",
    "transitops/frontend/src/views/DashboardView.tsx",
    "transitops/frontend/src/views/VehicleRegistry.tsx",
    "transitops/frontend/src/views/LoginView.tsx",
    "transitops/frontend/src/views/DriverSafety.tsx",
    "transitops/frontend/src/views/TripDispatcher.tsx",
    "transitops/frontend/src/views/MaintenanceView.tsx",
    "transitops/frontend/src/views/FuelExpenseView.tsx",
    "transitops/frontend/src/views/AnalyticsView.tsx",
    "transitops/frontend/src/views/SettingsView.tsx"
]

lucide_icons = [
    "Truck", "Search", "Bell", "LogOut", "X", "AlertCircle", "CheckCircle", "Plus", "ShieldCheck",
    "AlertTriangle", "MapPin", "Wrench", "Fuel", "CreditCard", "Download", "User", "Icon",
    "Activity", "Users", "Map", "BarChart2", "Settings"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Remove import lines
        content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];?\n?', '', content)
        
        for icon in lucide_icons:
            # Remove <IconName ... /> or <IconName />
            content = re.sub(rf'<{icon}\b[^>]*/>', '', content)
            content = re.sub(rf'<{icon}\b[^>]*>.*?</{icon}>', '', content)
            
            # Remove icon from array objects e.g., icon: Truck,
            content = re.sub(rf'icon:\s*{icon}\s*,', '', content)
        
        with open(filepath, 'w') as f:
            f.write(content)
