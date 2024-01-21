import { ROUTER } from "../../routes/routes.js"

export default class Main extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
        // this.submitFormListerner = (e) => {
        //     e.preventDefault();
        // }
        this.registerUser = (event) => {
            if (!event.detail.user) return
            console.log(event.detail.user)
        }
        this.loginUser = (event) => {
            console.log('logging from main', event)
        }
    }
    
    connectedCallback() {
        console.log('called')
        this.render()
        this.addEventListener('rt-register', this.registerUser)
        this.addEventListener('rt-login', this.loginUser)
    }

    disconnectedCallback() {
        console.log('disconnected main')
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        ${!this.isAuth ? /* HTML */ ` 
            <main>
                <div class="main-content">
                    Communnicate <br>
                    share and enjoy <br>
                </div>
                <div class="contents">
                    ${ROUTER.currentRoute === '/register' ? 
                        `<c-register class="form-f"></c-register>`
                        :
                        `<c-login class="form-f"></c-login>`
                    }
                    <div class="rigth-des">
                        <div class="rigth-content">
                            Join us <br> share <br>enjoy
                        </div>
                    </div>
                </div>          
            </main> `
        : `

            `
        }
        
        `
    }

    get header() {
        this.querySelector('.main-header')
    }

    get form() {
        return this.querySelector('form')
    }
}