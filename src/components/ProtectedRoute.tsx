import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "seller" | "buyer")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    console.warn(`Access denied: user has role "${role}" but route requires one of [${allowedRoles.join(", ")}]`);  
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
