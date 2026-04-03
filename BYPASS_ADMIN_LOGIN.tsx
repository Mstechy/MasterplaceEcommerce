import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function BypassAdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginAsAdmin = async () => {
      // Direct admin session (bypass login form for testing)
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: 'musiliuadekanbi14@mail.com',
        password: 'Semovita@12',
      });

      if (session) {
        navigate('/admin/dashboard');
      } else {
        console.error('Admin login failed:', error);
      }
    };

    loginAsAdmin();
  }, [navigate]);

  return <div>Setting up admin session...</div>;
}

// Add this route temporarily to App.tsx after admin routes:
// <Route path="/admin-bypass" element={<BypassAdminLogin />} />

// Then visit localhost:8080/admin-bypass to login as admin
