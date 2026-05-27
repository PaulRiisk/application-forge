// app entry, mounts react and wraps everything in the application provider

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// self-hosted fonts: dev uses plex + jetbrains, classic swaps to open sans
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";

import "./index.css";
import "./editor/editor.css";
import App from "./App.tsx";
import { AppProvider } from "./state/AppContext.tsx";
import { LocaleProvider } from "./i18n/LocaleContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LocaleProvider>
  </StrictMode>,
);
