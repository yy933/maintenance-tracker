import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSignOut = async (event) => {
    event.preventDefault();
    const { success, error: signOutError } = await signOutUser();

    if (success) {
      navigate("/signin");
    } else {
      setError(signOutError);
    }
  };
  return (
    <>
      <ModeToggle />
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive dark:bg-destructive/30"
          id="signout-error"
        >
          {error.message || error}
        </div>
      )}
      <Button onClick={handleSignOut} aria-label="Sign out of your account">
        Sign out
      </Button>
      <h1>Dashboard</h1>
    </>
  );
}
