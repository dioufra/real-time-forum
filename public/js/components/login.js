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
            })
            this.dispatchEvent(e)
        }
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        // this._style()
        // if (this.loginForm) console.log(this.loginForm)
        this.addEventListener('submit', this.formSubmission)
    }

    disconnectedCallback() {
        console.log('disconnected login')
        this.removeEventListener('submit', this.formSubmission)
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
            <div class="form-ff">
                <div class="title-form">
                    <p class="title-form">Connexion</p>
                </div>
                <p class="error-message"></p>
                <form class="connection-form" action="/api/login" method="post">
                <div class="input-form">
                    <input type="text" name="login" placeholder="email or username" >
                </div>
                <div class="input-form">                    
                    <input type="password" name="password" placeholder="password">
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
        console.log(this.header)
        this.appendChild(style)

    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }

    get loginForm() {
        return this.querySelector('form')
    }
}