import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// <<<<<<< HEAD
// =======
import "./index.css";
// >>>>>>> origin/image-gallery

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
