import { ROUTES_CONTROLLER } from "./routes.js";

// Route change listener
document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    ROUTES_CONTROLLER.navigateTo(ROUTES_CONTROLLER.currentRoute)
    // Handle navigation when a link is clicked
    document.body.addEventListener('click', function (event) {
        if (event.target.tagName === 'A' ) {
            event.preventDefault();
            ROUTES_CONTROLLER.navigateTo(event.target.href);
        }
    });
    // Handle navigation on back/forward button click
    window.addEventListener('popstate', function () {
        ROUTES_CONTROLLER.navigateTo(window.location.pathname)
    });
});