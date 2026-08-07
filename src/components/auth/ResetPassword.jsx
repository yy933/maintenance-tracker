import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/layout/AuthLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

export default function ResetPassword() {
 
  return (
    <AuthLayout>
      <form
        action={submitAction}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to reset your password
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
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              readOnly
              className="bg-background"
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "signup-error" : undefined}
              disabled={isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
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
            <FieldLabel htmlFor="confirm-password">
              Confirm New Password
            </FieldLabel>
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
            <FieldDescription>
              Please confirm your new password.
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit">
              {" "}
              {isPending ? "Resetting password..." : "Reset Password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
