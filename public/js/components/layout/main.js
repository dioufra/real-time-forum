import { ROUTES_CONTROLLER } from "../../controllers/routes.js"

export default class Header extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
    }

    connectedCallback() {
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
        ${!this.isAuth ? /* HTML */ ` 
            <main>
                <div class="main-content">
                    Communnicate <br>
                    share and enjoy <br>
                </div>
                <div class="main-content-subscribe">
                    <a class="subscribe" class="subscribe" href="/register">Subscribe</a>
                </div>
                <div class="contents">
                    ${ROUTES_CONTROLLER.currentRoute === '/register' ? 
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
        : ``
        }
        
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}