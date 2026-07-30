import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
export default function UserDashboard() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.id && user?.id !== userId) {
      toast.add({
        title: "Unauthorized",
        description:
          "You are not authorized to view this page. Redirect back to your personal dashboard.",
      });
      navigate(`/dashboard/${user.id}`);
    }
  }, [user?.id, userId, navigate]);
  // if user id not match, return null (prevent flashing during redirect)
  if (user?.id !== userId) {
    return null;
  }
  return (
    <>
      <h1 className="text-2xl font-bold">
        {user.name}'s Personal Repair Tracker
      </h1>

      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 p-6">
        <p>Personal Repair Tracker for {user.name} </p>
      </div>
    </>
  );
}
