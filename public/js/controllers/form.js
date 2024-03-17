import { updateComponents, updateSingleComponent } from "../script.js";

class FromController {
    constructor() {
        this.errors= {}
        this.forms = {}
    }
    setError(errName,message){
        this.errors[errName] = message
        updateComponents(errName)
    }
    setInput(form,target){
        this.forms[form] = this.forms[form] || {}
        if (target.name === "category") {
            this.forms[form][target.name]= []
            document.querySelectorAll('input[name="category"]')
            .forEach((elem)=> {
                if(elem.checked){
                    this.forms[form][target.name].push(elem.value)
                }
            })
            return
        }
        this.forms[form][target.name] = target.value
    }
    resetForms(){
        this.forms = {}
    }
    resetSingleForm(form){
        this.forms[form] = null
    }
    resetErrors(){
        this.errors = {}
    }
    resetError(error){
        this.errors[error] = null
    }
}
export const FORM_CONTROLLER = new FromController()