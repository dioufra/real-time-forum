import { FORM_CONTROLLER } from "../controllers/form.js"

export default class Register extends HTMLElement {
    constructor() {
        super()
        this.formSubmission = (event) => {
            // this.registerForm.checkValidity()
            event.preventDefault()
            const data = new FormData(this.registerForm)
            const userData = {}
            data.forEach((value, key) => {
                userData[key] = value
            })
            const e = new CustomEvent('rt-register', {
                detail: {user: userData},
                bubbles: true,
                cancalable: true,
            })
            this.dispatchEvent(e)
        }
    }
    
    connectedCallback() {
        if (this.shouldComponentRender) this.render()
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
            FORM_CONTROLLER.setInput('register',e.target)
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
        <div class="form-ff">
            <div class="title-form">
                <p class="title-form">Register</p>
            </div>
            <p class="error-message">${FORM_CONTROLLER.errors.register || ''}</p>
            <form id="register-form" action="/api/register" method="post">
                <div class="input-form">
                    <input type="text" name="firstname" placeholder="firstname" 
                        value="${FORM_CONTROLLER.forms?.register?.firstname ||''}" >
                </div>

                <div class="input-form">
                    <input type="text" name="lastname" placeholder="lastname"
                        value="${FORM_CONTROLLER.forms?.register?.lastname ||''}" >
                </div>

                <div class="input-form">
                    <input type="text" name="username" placeholder="username"
                        value="${FORM_CONTROLLER.forms?.register?.lastname ||''}" >
                </div>

                <div class="input-form">
                    <input type="email" name="email" placeholder="email"
                        value="${FORM_CONTROLLER.forms?.register?.email ||''}" >
                </div>

                <div class="input-form">
                <input type="number" name="age" placeholder="age" required 
                    value="${FORM_CONTROLLER.forms?.register?.age ||''}" />
                </div>
                <div class="input-form">
                    <span>Gender:</span>
                    <input type="radio" name="gender" value="Male" checked>
                    Male
                    <input type="radio" name="gender" value="Female">
                    Female
                </div>

                <div class="input-form">
                    <input type="password" name="password" placeholder="password"
                        value="${FORM_CONTROLLER.forms?.register?.password ||''}" >
                </div>

                <div class="input-form">
                    <input type="password" name="repeatpassword" placeholder="repeat password"
                        value="${FORM_CONTROLLER.forms?.register?.repeatpassword ||''}" >
                </div>

                <button class="submit-btn" type="submit">register</button>
            </form>
        </div>
        `
    }


    _style() {
        const style = document.createElement('style')
        style.textContent = `
        ${this.tagName} .main-header{
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: space-between;
            padding: 20px;
        }
        ${this.tagName} .main-header>.menu-a{
            padding: 0;
            background-color: #002ea3;
            width: 150px;
            height: 37px;
            border-radius: 23px;
            justify-content: center;
            align-items: center;
            font-weight: 600;
        }
        ${this.tagName} .main-header .join {

        }

        `
        this.appendChild(style)

    }

    get header() {
        return this.querySelector('.main-header')
    }

    get registerForm() {
        return this.querySelector('form')
    }
}