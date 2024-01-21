import { FORM_CONTROLLER } from "../controllers/form.js"

export default class Login extends HTMLElement {
    constructor() {
        super()
        // this.isAuth = false
    }

    connectedCallback() {
        // console.log(this)
        this.render()
    }

    disconnectedCallback() {
        console.log('disconnected')
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        let formAction = 'login'
        FORM_CONTROLLER.registerForm(formAction)
        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Connexion</p>
                </div>
                <p class="error-message">${FORM_CONTROLLER.forms[formAction].error?.message || ''}</p>
                <c-form class="connection-form" action="${formAction}" method="post">
                    <div class="input-form">
                        <input type="email" name="email" placeholder="email" >
                    </div>
                    <div class="input-form">                    
                        <input type="password" name="password" placeholder="password">
                    </div>
                    <button class="submit-btn" type="button">envoyer</button>
                </c-form>
            </div>
        `
    }
    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}