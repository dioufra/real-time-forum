import { updateComponents } from "../script.js";

class RoutesController {
    constructor(props) {
        this.currentRoute = ''
    }
    navigateTo(url){
        // Update the URL and push a state to the browser's history
        history.pushState(null, null, url);
        this.currentRoute = window.location.pathname
        updateComponents()
    }
}

export var ROUTES_CONTROLLER = new RoutesController()