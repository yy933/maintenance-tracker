import { useActionState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
export default function ForgotPassword() {
  const { sendPasswordResetEmail } = useAuth();
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get("email");
      if (!email) {
        return { success: false, error: "Please enter your email address.", message: null };
      }
      const { success, error: resetError } =
        await sendPasswordResetEmail(email);
      if (resetError) {
        return {
          success: false,
          error: resetError,
          message: null,
        };
      }
      if (success) {
        return {
          success: true,
          error: null,
          message: "Check your email for the password reset link.",
        };
      }
      return {
        success: false,
        error: null,
        message: "Failed to send password reset email. Please try again.",
      };
    },
    { success: false, error: null, message: null },
  );

  return (
    <AuthLayout>
      <form action={submitAction} className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Forgot password?</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email address below and we'll send you a link to reset
              your password.
            </p>
          </div>
          {state.error && (
            <div
              id="signup-error"
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive dark:bg-destructive/30"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          {state.success && state.message && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-600 dark:bg-green-500/30 dark:text-green-400"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              className="bg-background"
              aria-required="true"
              aria-invalid={state.error ? "true" : "false"}
              aria-describedby={state.error ? "signup-error" : undefined}
              disabled={isPending}
            />
          </Field>

          <Field>
            <Button type="submit">
              {" "}
              {isPending ? "Sending password reset email..." : "Reset Password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
