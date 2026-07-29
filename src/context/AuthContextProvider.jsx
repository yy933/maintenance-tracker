import { AuthContext } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import supabase from "../supabase/supabase-client";

export default function AuthContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single(); // return single object
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Fetch user profile error: ", error.message);
      setProfile(null);
    }
  };

  // get session on first render
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // get session from supabase
        const { data, error } = await supabase.auth.getSession();

        // throw supabase error if no session
        if (error) throw error;
        // setSession if no error
        setSession(data.session);
        // fetch user profile
        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Auth init error: ", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);
  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}
