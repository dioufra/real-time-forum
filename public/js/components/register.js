import { CURRENT_USER } from "../controllers/user.js"

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
        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Register</p>
                </div>
                <p class="error-message">${''}</p>
                <form class="connection-form" action="/register" method="post">
                    <div class="input-form">
                        <input type="text" name="firthname" placeholder="firthname" required value="${CURRENT_USER.FirstName}" />
                    </div>

                    <div class="input-form">
                        <input type="text" name="lastname" placeholder="lastname" required value="${CURRENT_USER.LastName}" />
                    </div>

                    <div class="input-form">
                        <input type="text" name="username" placeholder="username" required value="${CURRENT_USER.UserName}" />
                    </div>

                    <div class="input-form">
                        <input type="email" name="email" placeholder="email"required  value="${CURRENT_USER.Email}" />
                    </div>

                    <div class="input-form">
                        <input type="password" name="password"required placeholder="password"  />
                    </div>

                    <div class="input-form">
                        <input type="password" name="repeatpassword" required placeholder="repeat password">
                    </div>

                    <button class="submit-btn" type="submit">envoyer</button>
                </form>
            </div>
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}