import "./font.css";
import "./styles.css";

import Providers from "@/components/Common/Providers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./routes";

createRoot(document.getElementById("_hey_") as HTMLElement).render(
  <StrictMode>
    <Providers>
      <Routes />
    </Providers>
  </StrictMode>
);
