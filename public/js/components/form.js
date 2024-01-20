import { CURRENT_USER } from "../user/user.js"

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
            elem.value = CURRENT_USER.forms[this.action][elem.name]||''
            elem.addEventListener('input',(e)=>{
                this.form[e.target.name] = e.target.value
                CURRENT_USER.updateForm(this.action,e.target.name,e.target.value)
            })
        })
    }
    checkSubmitListener(){
        this.querySelectorAll('button.submit-btn').forEach(elem => {
            elem.addEventListener('click',(e)=>{
                let err = this.isFormSubmittable()
                if (err) {
                    CURRENT_USER.setError(this.action,err)
                }else {
                    alert('submit')
                }
            })
        })
    }
    isFormSubmittable(){
        let error = null;
        [...this.querySelectorAll('input')].reverse().forEach(elem => {
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

    disconnectedCallback() {
        // console.log('disconnected')
    }

    render() {
    }
}