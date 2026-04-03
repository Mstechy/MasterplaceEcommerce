import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoleRedirect() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const maxWait = 5000;
  const [startTime, setStartTime] = useState(Date.now());

  // Logging for debugging
  useEffect(() => {
    console.log(`[RoleRedirect] State - Loading: ${loading}, Role: ${role}, Retry: ${retryCount}, User: ${user?.email}`);
  }, [loading, role, user, retryCount]);

  // Retry logic if role null post-loading
  useEffect(() => {
    if (!loading && !user) return;
    if (loading || role) return;

    const elapsed = Date.now() - startTime;
    if (retryCount < maxRetries && elapsed < maxWait) {
      const timeoutId = setTimeout(() => {
        console.log(`[RoleRedirect] Retry ${retryCount + 1}/${maxRetries}`);
        setRetryCount(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, role, retryCount, startTime, maxRetries, maxWait, user, navigate]);

  // 1. Handle Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse text-muted-foreground">Verifying role...</p>
      </div>
    );
  }

  // 2. No user -> login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3. Role found -> immediate redirect
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "seller") return <Navigate to="/seller/dashboard" replace />;
  if (role === "buyer") return <Navigate to="/buyer/dashboard" replace />;

  // 4. Role not found after retries (5s/3 tries)
  const elapsed = Date.now() - startTime;
  if (elapsed >= maxWait || retryCount >= maxRetries) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
        <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">Role Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Role for {user.email} not readable after retries. Check console [useAuth] logs.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // 5. Still waiting for role...
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">
        Waiting for role sync... ({Math.round((Date.now() - startTime)/1000)}s)
      </p>
    </div>
  );
}

