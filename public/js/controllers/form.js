import { updateComponents } from "../script.js"

class FormsController {
    constructor() {
        this.forms = {}
    }
    registerForm(action){
        this.forms[action] = this.forms[action] || {}
    }
    removeForm(action){
        this.forms[action] = null
    }
    setError(action,err){
        this.forms[action].error = err
        updateComponents()
    }
    removeError(action){
        this.forms[action].error = null
        updateComponents()
    }
    hasError(action,property){
        return Boolean(this.forms[action].error?.property === property)
    }
    updateForm(action,property,value){
        this.forms[action][property] = value
    }
    isFormSubmittable(form){
        let error = {property:null,message:null};
        [...form.querySelectorAll('input')].reverse().forEach(elem => {
            switch (elem.type) {
                case 'email':
                    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                    if (!emailRegex.test(elem.value)) {
                        error.property = elem.name
                        error.message = 'Email non valid'
                    }
                    break;
                case 'password':
                    if (elem.name === 'repeatpassword') {
                        if (elem.value !== document.querySelector('input[name=password]')?.value) {
                            error.property = elem.name
                            error.message = 'passwords do not match'
                        }
                    }else if (elem.value.length < 4) {
                        error.property = elem.name
                        error.message = 'The password must be at least 4 characters'
                    }
                    break;
                default:
                    if (elem.value.length < 1) {
                        error.property = elem.name
                        error.message = `The ${elem.name} box is required`
                    }
                    break;
            }
        })
        return error
    }
}
export const FORM_CONTROLLER = new FormsController()