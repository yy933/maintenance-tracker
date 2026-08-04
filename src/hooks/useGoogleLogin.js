import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
export const useGoogleLogin = () => {
  const { signInWithGoogle } = useAuth();
  const [oauthError, setOauthError] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setOauthError(null);

      const { success, error } = await signInWithGoogle();

      if (!success) {
        setOauthError(error || "Google login failed. Please try again.");
        setGoogleLoading(false);
        console.error("Google sign-in error:", error);
      }
      // Note: if success, the user will be redirected to the dashboard via the OAuth flow, so no further action is needed here.(no need to setGoogleLoading(false) in this case)
    } catch (error) {
      setOauthError("An unexpected error occurred.");
      setGoogleLoading(false);
      console.error("Unexpected error during Google sign-in: ", error);
    }
  };

  return { handleGoogleSignIn, oauthError, googleLoading };
};
