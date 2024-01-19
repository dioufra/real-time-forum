export var ROUTER = {
    currentRoute : ''
}

class RoutesController {
    constructor(props) {
        this.routesList = []
    }
    registerRoute(route, callBack){
        return callBack()
    }
}

export var ROUTES_CONTROLLER = new RoutesController()