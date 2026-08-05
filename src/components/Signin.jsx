import { LoginForm } from "@/components/ui/login-form";

import AuthHeader from "./AuthHeader";
import { useAuth } from "../hooks/useAuth";
import { useActionState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const { signInUser, session } = useAuth();
  const navigate = useNavigate();
  const [state, submitAction, pending] = useActionState(
    async (prevState, formData) => {
      // Extract formdata
      const email = formData.get("email");
      const password = formData.get("password");

      // Sign in user
      const { success, error: signInError } = await signInUser(email, password);

      // success
      if (success) {
        return { success: true, error: null };
      }

      // not success
      return {
        success: false,
        error: signInError || "Login failed. Please check your credentials.",
      };
    },
    { success: false, error: null },
  );
  useEffect(() => {
    if (state?.success || session) {
      navigate("/dashboard", { replace: true });
    }
  }, [state, session, navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <AuthHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              error={state?.error}
              submitAction={submitAction}
              pending={pending}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/homepage-cover.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
