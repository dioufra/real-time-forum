import { ROUTER } from "../../routes/routes.js"

export default class Header extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
        this.submitFormListerner = (e) => {
            console.log('submitted');
            console.log(e)
            e.preventDefault();
        }
    }
    
    connectedCallback() {
        console.log('called')
        this.render()
        this.form?.addEventListener('submit', this.submitFormListerner)
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
                <div class="main-content-subscribe">
                    <a class="subscribe" class="subscribe" href="/register">Subscribe</a>
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