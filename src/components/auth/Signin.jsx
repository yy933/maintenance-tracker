import AuthLayout from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/ui/login-form";
import { useAuth } from "../../hooks/useAuth";
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
    <AuthLayout>
      {" "}
      <LoginForm
        error={state?.error}
        submitAction={submitAction}
        pending={pending}
      />
    </AuthLayout>
  );
}
