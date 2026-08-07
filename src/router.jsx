import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import RootRedirect from "./routes/RootRedirect";
import MainLayout from "./components/layout/MainLayout";
import UserDashboard from "./components/user-dashboard/UserDashboard";
import { Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  /* ================= Protected routes ================= */
  {
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/:userId",
        element: <UserDashboard />,
      },
    ],
  },
  // unknown paths (redirect to home)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
