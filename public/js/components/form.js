import { FORM_CONTROLLER } from "../controllers/form.js"
export default class Form extends HTMLElement {
    constructor() {
        super()
        // this.isAuth = false
        this.form = {}
        this.action = this.getAttribute('action')
        this.method = this.getAttribute('method')
    }

    connectedCallback() {
        // this.render()
        this.checkInputsListener()
        this.checkSubmitListener()
    }
    checkInputsListener(){
        this.querySelectorAll('input').forEach(elem => {
            elem.value = FORM_CONTROLLER.forms[this.action][elem.name]||''
            elem.addEventListener('input',(e)=>{
                this.form[e.target.name] = e.target.value
                FORM_CONTROLLER.updateForm(this.action,e.target.name,e.target.value)
                if (FORM_CONTROLLER.hasError(this.action,elem.name)) {
                    // Disconnect an reconnect component to romeve Error msg
                    FORM_CONTROLLER.removeError(this.action)
                    // Focus to the current input
                    document.querySelector(`input[name=${elem.name}]`).focus()
                }
            })
        })
    }
    checkSubmitListener(){
        this.querySelectorAll('button.submit-btn').forEach(elem => {
            elem.addEventListener('click',(e)=>{
                let err = FORM_CONTROLLER.isFormSubmittable(this)
                if (err.message) {
                    FORM_CONTROLLER.setError(this.action,err)
                }else {
                    console.log(FORM_CONTROLLER.forms[this.action])
                    fetch('http://127.0.0.1:8080/sign_up',{method:'POST'})
                    .then(res => console.log(res.body))
                    .catch(console.log)
                }
            })
        })
    }

    disconnectedCallback() {
        // console.log('disconnected')
    }

    render() {
    }
}