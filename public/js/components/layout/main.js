import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"
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
            fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(event.detail.user),
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                       response.json() // Parse the JSON in the response
                            .then(error => {
                                console.log(error)
                            })
                    } else {
                        throw new Error('Erreur de réseau');
                    }
                }
                return response
            }).then(data => {
                if (data) {
                    console.log(data)
                    // Redirect to login page
                    navigateTo('login')
                }
            }).catch(console.log);
        }
        this.loginUser = (event) => {
            if (!event.detail.user) return
            fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(event.detail.user),
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                       response.json() // Parse the JSON in the response
                            .then(error => {
                                console.log(error)
                            })
                    } else {
                        throw new Error('Erreur de réseau');
                    }
                }
                return response
            }).then(data => {
                if (data) {
                    console.log(data)
                    // USER_CONTROLLER.fetchData()
                    // navigateTo('')
                }
            }).catch(console.log);
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