import { createApp } from "vue";
import "./styles/style.scss";
import App from "./App.vue";

createApp(App).mount("#app");

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").then(
            (registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
            },
            (err) => {
                console.error("Service Worker registration failed:", err);
            }
        );
    });
}
