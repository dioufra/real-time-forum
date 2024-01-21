export var ROUTER = {
    currentRoute : ''
}

class RoutesController {
    constructor(props) {
        this.routesList = []
    }
    registerRoute(route, callBack){
        console.log('registering a route', route)
        return callBack()
    }
}

export var ROUTES_CONTROLLER = new RoutesController()