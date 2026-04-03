import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = "admin" | "seller" | "buyer";

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfilesRow | null;
  role: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfilesRow | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    setLoading(true); 
    try {
      // 1. Fetch both at the same time
      // Enhanced role fetch with retry and RPC fallback
      // Simplified role fetch - direct query (RLS allows self-view)
      // Try RPC first (bypass RLS)
      const { data: rpcRole } = await supabase.rpc('get_user_role', { _user_id: userId });
      console.log('[useAuth] RPC role:', rpcRole);
      if (rpcRole) {
        setRole(rpcRole as AppRole);
        // Fetch profile...
        const profileRes = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
        if (profileRes.data) setProfile(profileRes.data);
        setLoading(false);
        return;
      }

      // Fallback direct
      console.log('[useAuth] RPC failed, direct query for user_id:', userId);
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();
      
      if (error) console.error('[useAuth] Direct error:', error.message);
      
      const finalRole = roleData?.role as AppRole || 'buyer';
      console.log('[useAuth] Final role:', finalRole);


      // Fetch profile
      const profileRes = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
      if (profileRes.data) {
        setProfile(profileRes.data);
      }

      setLoading(false);
    } catch (e) {
      console.error("Auth Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          fetchUserData(currentSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, selectedRole: AppRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) return { error: error.message };

    if (data.user) {
      // Insert role into user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: data.user.id, 
          role: selectedRole 
        });

      if (roleError) {
        console.error("Role insertion error:", roleError);
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
    );

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

