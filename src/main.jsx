import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import { ThemeProvider } from "./context/ThemeContextProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthContextProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>,
);
