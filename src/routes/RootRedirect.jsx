import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const { session } = useAuth();
  if (session === undefined) {
    return <h1>Loading...</h1>

  } 
  return session ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />;
};

export default RootRedirect;