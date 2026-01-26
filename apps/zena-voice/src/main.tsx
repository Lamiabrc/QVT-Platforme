import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// --- Point d'entree principal ---
const container = document.getElementById("root");
if (!container) throw new Error("Element #root introuvable dans index.html");

const root = createRoot(container);

// --- Rendu React ---
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// --- Service Worker ---
if ("serviceWorker" in navigator) {
  if (import.meta.env.MODE === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((registration) => {
          console.log("Service Worker enregistre :", registration.scope);
        })
        .catch((error) => {
          console.error("Erreur d'enregistrement du SW :", error);
        });
    });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.unregister())
      .catch(() => {});

    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch(() => {});
  }
}

// --- Gestion des erreurs globales ---
window.addEventListener("error", (event) => {
  console.error("Erreur globale detectee :", event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promesse non geree :", event.reason);
});
