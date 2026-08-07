import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "@/components/ui/google-login-button";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export function LoginForm({
  className,
  submitAction,
  pending,
  error: formError,
  ...props
}) {
  const isInvalid = Boolean(formError);
  const { handleGoogleSignIn, oauthError, googleLoading } = useGoogleLogin();

  const displayError = formError?.message || formError || oauthError;

  return (
    <form
      action={submitAction}
      className={cn("flex flex-col gap-6", className)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        {displayError && (
          <div
            id="signin-error"
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive dark:bg-destructive/30"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? "signin-error" : undefined}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? "signin-error" : undefined}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleLoginButton
            handleGoogleSignIn={handleGoogleSignIn}
            pending={pending}
            googleLoading={googleLoading}
          />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
