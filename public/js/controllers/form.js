import { updateComponents } from "../script.js";

class FromController {
    constructor() {
        this.errors= {}
        this.forms = {}
    }
    setError(errName,message){
        this.errors[errName] = message
        updateComponents()
    }
    setInput(form,target){
        this.forms[form] = this.forms[form] || {}
        this.forms[form][target.name] = target.value
    }
}
export const FORM_CONTROLLER = new FromController()