export default class Register extends HTMLElement {
    constructor() {
        super()
        this.formSubmission = (event) => {
            console.log('submitted', this.registerForm.checkValidity())
            event.preventDefault()
            const data = new FormData(this.registerForm)
            const userData = {}
            data.forEach((value, key) => {
                userData[key] = value
            })
            
        }
    }
    
    connectedCallback() {
        if (this.shouldComponentRender) this.render()
        if (this.registerForm) console.log(this.registerForm)
        this.addEventListener('submit', this.formSubmission)
    }

    disconnectedCallback() {
        console.log('disconnected register')
        this.removeEventListener('submit', this.formSubmission)
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        <div class="form-ff">
            <div class="title-form">
                <p class="title-form">Register</p>
            </div>
            <p class="error-message"></p>
            <form id="register-form" action="/" method="get">
                <div class="input-form">
                    <input type="text" name="firthname" placeholder="firthname">
                </div>

                <div class="input-form">
                    <input type="text" name="lastname" placeholder="lastname">
                </div>

                <div class="input-form">
                    <input type="text" name="username" placeholder="username">
                </div>

                <div class="input-form">
                    <input type="email" name="email" placeholder="email">
                </div>

                <div class="input-form">
                    <input type="password" name="password" placeholder="password">
                </div>

                <div class="input-form">
                    <input type="password" name="repeatpassword" placeholder="repeat password">
                </div>

                <button class="submit-btn" type="submit">envoyer</button>
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