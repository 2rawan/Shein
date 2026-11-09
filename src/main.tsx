import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { loadProducts } from "@/lib/products";
import { router } from "@/router";
import "./index.css";

// Start fetching the catalogue alongside the first render.
void loadProducts();

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
