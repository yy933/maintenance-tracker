import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import RootRedirect from "./routes/RootRedirect";

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
    path: "/dashboard",
    element: <Dashboard />
  }
]);