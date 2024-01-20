import { CURRENT_USER } from "../user/user.js"

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
        CURRENT_USER.forms[formAction] = CURRENT_USER.forms[formAction] || {}
        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Connexion</p>
                </div>
                <p class="error-message">${CURRENT_USER.forms[formAction].error || 'f'}</p>
                <c-form class="connection-form" action="${formAction}" method="post">
                    <div class="input-form">
                        <input type="email" name="email" placeholder=" email" >
                    </div>
                    <div class="input-form">                    
                        <input type="password" name="password" placeholder="password">
                    </div>                        
                    <button class="submit-btn" type="button">envoyer</button>
                </c-form>
            </div>
        `
        // <form class="connection-form" action="/login" method="post">
        //     <div class="input-form">
        //         <input type="text" name="email" placeholder=" email" >
        //     </div>
        //     <div class="input-form">                    
        //         <input type="password" name="password" placeholder="password">
        //     </div>                        
        //     <button class="submit-btn" type="submit">envoyer</button>
        // </form>
    }
    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}