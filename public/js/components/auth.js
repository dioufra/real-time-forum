import { ROUTER } from "../routes/routes.js"

export default class Auth extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
            <main>
                <div class="main-content">
                    Communnicate <br>
                    share and enjoy <br>
                </div>
                <div class="contents">
                    ${ROUTER.currentRoute === '/register' 
                    ? /* HTML */
                        `<c-register class="form-f"></c-register>`
                    : /* HTML */
                        `<c-login class="form-f"></c-login>`
                    }
                        <div class="rigth-des">
                            <div class="rigth-content">
                                Join us <br> share <br>enjoy
                            </div>
                        </div>
                </div>          
            </main> 
        `
    }

    get header() {
        this.querySelector('.main-header')
    }

    get form() {
        return this.querySelector('form')
    }
}