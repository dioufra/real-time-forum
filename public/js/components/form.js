import { FORM_CONTROLLER } from "../controllers/form.js"
export default class Form extends HTMLElement {
    constructor() {
        super()
        // this.isAuth = false
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

            // Pour les input de type RADIO
            if (elem.type === 'radio') {

                if (!FORM_CONTROLLER.forms[this.action][elem.name]) {
                    FORM_CONTROLLER.updateForm(this.action,elem.name,elem.value)
                }
                if (FORM_CONTROLLER.forms[this.action][elem.name] === elem.value) {
                    elem.checked = true
                }
                elem.addEventListener('change',(e)=> {
                    FORM_CONTROLLER.updateForm(this.action,e.target.name,e.target.value)
                })
            }else{
                elem.value = FORM_CONTROLLER.forms[this.action][elem.name]||elem.value 
                elem.addEventListener('input',(e)=>{
                    FORM_CONTROLLER.updateForm(this.action,e.target.name,e.target.value)
                    if (FORM_CONTROLLER.hasError(this.action,elem.name)) {
                        // Disconnect an reconnect component to romeve Error msg
                        FORM_CONTROLLER.removeError(this.action)
                        // Focus to the current input
                        document.querySelector(`input[name=${elem.name}]`).focus()
                    }
                })
            }
        })
    }
    checkSubmitListener(){
        this.querySelectorAll('button.submit-btn').forEach(elem => {
            elem.addEventListener('click',(e)=>{
                let err = FORM_CONTROLLER.isFormSubmittable(this)
                if (err.message) {
                    FORM_CONTROLLER.setError(this.action,err)
                }else {
                    // console.log(FORM_CONTROLLER.forms[this.action])
                    fetch('http://127.0.0.1:8080/register',{
                        method:'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(FORM_CONTROLLER.forms[this.action]),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
                    .catch(error => {
                        if (error.message === 'Failed to fetch') {
                            FORM_CONTROLLER.setError(this.action,{message:'Unable to connect to API!<br>try again please'})
                        }
                        console.error('Error Submitting Form:', error)
                    });
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