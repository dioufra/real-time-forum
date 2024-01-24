import { updateComponents } from "../script.js";
import { ROUTER } from "./routes.js";

// Route change listener
document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    console.log('Navigating to route', ROUTER.currentRoute)
    navigateTo(ROUTER.currentRoute)
    // Handle navigation when a link is clicked
    document.body.addEventListener('click', function (event) {
        if (event.target.tagName === 'A' ) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    });
    // Handle navigation on back/forward button click
    window.addEventListener('popstate', function () {
        console.log('clicked')
        navigateTo(window.location.pathname)
    });
});

export function navigateTo(url) {
    // Update the URL and push a state to the browser's history
    history.pushState(null, null, url);
    ROUTER.currentRoute = window.location.pathname
    updateComponents()
}

