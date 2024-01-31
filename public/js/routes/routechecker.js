import { updateComponents } from "../script.js";
import { ROUTER } from "./routes.js";

// Route change listener
document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    navigateTo(ROUTER.currentRoute)
    
    // Handle navigation on back/forward button click
    window.addEventListener('popstate', function () {
        navigateTo(window.location.pathname)
    });
});

export function navigateTo(url) {
    // Update the URL and push a state to the browser's history
    history.pushState(null, null, url);
    ROUTER.currentRoute = window.location.pathname
    updateComponents()
}

