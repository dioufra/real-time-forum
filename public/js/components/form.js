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
            })
        })
    }
    checkSubmitListener(){
        this.querySelectorAll('button.submit-btn').forEach(elem => {
            elem.addEventListener('click',(e)=>{
                let err = FORM_CONTROLLER.isFormSubmittable(this)
                if (err) {
                    FORM_CONTROLLER.setError(this.action,err)
                }else {
                    alert('submit')
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