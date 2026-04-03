import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoleRedirect() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  // Logging for debugging in F12 Console
  useEffect(() => {
    console.log("[RoleRedirect] State Check - Loading:", loading, "Role:", role, "User:", user?.email);
  }, [loading, role, user]);

  // 1. Handle Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse text-muted-foreground"> Verifying Admin Credentials...</p>
      </div>
    );
  }

  // 2. If no user is logged in, kick them to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3. The Redirect Logic
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "seller") return <Navigate to="/seller/dashboard" replace />;
  if (role === "buyer") return <Navigate to="/buyer/dashboard" replace />;

  // 4. Emergency Fallback (Prevents White Screen)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-xl font-bold mb-2">Role Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-xs">
        Your account is verified in Supabase, but the app cannot read your 'Admin' role yet. 
        This is usually caused by **RLS Policies**.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>Retry Role Sync</Button>
        <p className="text-xs text-muted-foreground mt-4">Check console for [useAuth] logs.</p>
      </div>
    </div>
  );
}

