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
    "LayoutDashboard", "BarChart3", "TrendingUp", "LucideIcon", "Map"
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for icon in lucide_icons:
            # Remove <IconName ... /> or <IconName />
            content = re.sub(rf'<{icon}\b[^>]*/>', '', content)
            content = re.sub(rf'<{icon}\b[^>]*>.*?</{icon}>', '', content)
            
            # Remove icon from array objects e.g., icon: Truck,
            content = re.sub(rf'icon:\s*{icon}\s*,', '', content)
            content = re.sub(rf'icon:\s*{icon}\s*', '', content)
            
        # specifically fix KPICard
        content = re.sub(r'icon:\s*LucideIcon;?', '', content)
        content = re.sub(r'const\s+Icon\s*=\s*icon;', '', content)
        
        with open(filepath, 'w') as f:
            f.write(content)
