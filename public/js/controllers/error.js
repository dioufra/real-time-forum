import { updateComponents } from "../script.js";

class ErrorController {
    constructor() {
        this.errors= {}
    }
    setError(errName,message){
        this.errors[errName] = message
        updateComponents()
    }
}
export const ERROR_CONTROLLER = new ErrorController()