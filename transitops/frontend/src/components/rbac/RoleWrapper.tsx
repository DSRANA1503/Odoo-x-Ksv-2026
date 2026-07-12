import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface RoleWrapperProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RoleWrapper({ allowedRoles, children }: RoleWrapperProps) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Don't render anything if not authorized
  }

  return <>{children}</>;
}
