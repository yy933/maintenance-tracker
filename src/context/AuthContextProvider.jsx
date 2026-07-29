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

  
  useEffect(() => {
    // listen for auth changes (including initial load, signin, signout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      // fetch user profile when auth user login 
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      } else {
        // reset profile when auth user logout
        setProfile(null);
      }
      setLoading(false);
    });

    // cleanup: unsubscribe when unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}
