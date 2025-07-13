
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermission?: 'read' | 'write';
}

export const ProtectedRoute = ({ children, requiredRoles, requiredPermission }: ProtectedRouteProps) => {
  const { user, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return <>{children}</>;
};
