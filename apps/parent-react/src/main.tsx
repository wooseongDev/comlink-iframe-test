import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CounterFrame } from "./components/counter-frame";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CounterFrame />
  </StrictMode>
);
