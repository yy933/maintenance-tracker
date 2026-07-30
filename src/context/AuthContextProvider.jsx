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
      console.log("Fetch user profile success: ", data)
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

  // sign-in
  const signInUser = async (email, password) => {
    try {
      // supabase sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      // supabase error
      if (error) {
        return { success: false, error: error.message };
      }

      // success
      console.log("Supabase sign-in success: ", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in: ", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  // sign-out
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      // supabase error
      if (error) {
        return { success: false, error: error.message };
      }
      // success
      console.log("Supabase sign-out success");
      return { success: true };
    } catch (error) {
      console.error("Unexpected error during sign-out: ", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email, 
        name: profile?.name || session.user.email.split("@")[0], 
      }
    : null;
  return (
    <AuthContext.Provider
      value={{ session, loading, profile, user, signInUser, signOutUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
