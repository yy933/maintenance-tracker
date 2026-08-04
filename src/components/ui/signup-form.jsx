import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "@/components/ui/google-login-button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();
  const { handleGoogleSignIn, oauthError, googleLoading } = useGoogleLogin();
  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirm-password");
      if (password !== confirmPassword) {
        return new Error("Passwords do not match");
      }
      const {
        success,
        data,
        error: signUpError,
      } = await signUpNewUser(email, password, name);
      if (signUpError) return new Error(signUpError);
      if (success && data?.session) {
        navigate("/dashboard");
        return null;
      }

      return null;
    },
    null,
  );

  const displayError = error?.message || error || oauthError;
   
  return (
    <form
      action={submitAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        {displayError && (
          <div
            id="signup-error"
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive dark:bg-destructive/30"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-background"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-background"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className="bg-background"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">
            {" "}
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleLoginButton
            handleGoogleSignIn={handleGoogleSignIn}
            pending={isPending}
            googleLoading={googleLoading}
          />
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/signin">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
