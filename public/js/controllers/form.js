import { updateComponents } from "../script.js"

class FormsController {
    constructor() {
        this.forms = {}
    }
    setError(action,err){
        this.forms[action].error = err
        updateComponents()
    }
    updateForm(action,property,value){
        this.forms[action][property] = value
    }
    isFormSubmittable(form){
        let error = null;
        [...form.querySelectorAll('input')].reverse().forEach(elem => {
            switch (elem.type) {
                case 'email':
                    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                    if (!emailRegex.test(elem.value)) {
                        error = 'Email non valid'
                    }
                    break;
                case 'password':
                    if (elem.value.length < 4) {
                        error = 'The password must be at least 4 characters'
                    }
                    break;
                default:
                    break;
            }
        })
        return error
    }
}
export const FORM_CONTROLLER = new FormsController()