import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

export const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
]);