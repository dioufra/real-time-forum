import { FORM_CONTROLLER } from "../controllers/form.js"

export default class Login extends HTMLElement {
    constructor() {
        super()
        this.formSubmission = (event) => {
            event.preventDefault()
            const data = new FormData(this.loginForm)
            const userData = {}
            data.forEach((value, key) => {
                userData[key] = value
            })
            const e = new CustomEvent('rt-login', {
                detail: {user: userData},
                bubbles: true,
                cancalable: true,
                composed: true
            })
            this.dispatchEvent(e)
        }
    }

    connectedCallback() {
        this.render()
        this.addEventListener('submit', this.formSubmission)
        this.checkInputListener()
    }

    disconnectedCallback() {
        this.removeEventListener('submit', this.formSubmission)
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    
    checkInputListener(){
        this.addEventListener('input',e => {
            FORM_CONTROLLER.setInput('login',e.target)
        })
    }
    render() {
        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Connexion</p>
                </div>
                <p class="error-message">${FORM_CONTROLLER.errors.login || ''}</p>
                <form class="connection-form" action="/api/login" method="post">
                <div class="input-form">
                    <input type="text" name="login" placeholder="email or username" 
                        value="${FORM_CONTROLLER.forms?.login?.login ||''}" >
                </div>
                <div class="input-form">                    
                    <input type="password" name="password" placeholder="password" 
                        value="${FORM_CONTROLLER.forms?.login?.password ||''}">
                </div>                        
                    <button class="submit-btn" type="submit">envoyer</button>
                </form>
            </div>
        `
    }

    get header() {
        this.querySelector('.main-header')
    }

    get loginForm() {
        return this.querySelector('form')
    }
}