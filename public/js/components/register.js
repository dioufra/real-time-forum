import { FORM_CONTROLLER } from "../controllers/form.js"

export default class Register extends HTMLElement {
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
        let formAction = 'register'
        FORM_CONTROLLER.registerForm(formAction)

        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Register</p>
                </div>
                <p class="error-message">${FORM_CONTROLLER.forms[formAction].error?.message || ''}</p>
                <c-form class="connection-form" action="${formAction}" method="post">
                    <div class="input-form">
                        <input type="text" name="firstname" placeholder="firstname" required />
                    </div>
                    <div class="input-form">
                        <input type="text" name="lastname" placeholder="lastname" required />
                    </div>
                    <div class="input-form">
                        <input type="number" name="age" placeholder="age" required />
                    </div>
                    <div class="input-form">
                        <span>Gender:</span>
                        <input type="radio" name="gender" value="Male">
                        Male
                        <input type="radio" name="gender" value="Female">
                        Female
                    </div>
                    <div class="input-form">
                        <input type="text" name="username" placeholder="username" required />
                    </div>
                    <div class="input-form">
                        <input type="email" name="email" placeholder="email"required />
                    </div>
                    <div class="input-form">
                        <input type="password" name="password"required placeholder="password"  />
                    </div>
                    <div class="input-form">
                        <input type="password" name="repeatpassword" required placeholder="repeat password">
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