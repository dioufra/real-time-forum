
import { USER_CONTROLLER } from "../../controllers/user.js"
import { ROUTER } from "../../routes/routes.js"
import { updateComponents } from "../../script.js"
import {API_SERVICE} from "../../service/api-service.js"

export default class Main extends HTMLElement {
    constructor() {
        super()
        this.registerUser = (event) => {
            API_SERVICE.registerUser(event.detail.user)
        }
        this.loginUser = (event) => {
            if (!event.detail.user) return;
        
            API_SERVICE.loginUser(event.detail.user)
                .then(data => {
                    updateComponents()
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    connectedCallback() {
        this.render()
        this.addEventListener('rt-register', this.registerUser)
        this.addEventListener('rt-login', this.loginUser)
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        ${!USER_CONTROLLER.IsAuth ? /* HTML */ ` 
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
            </main> 
        `
        : 
        /* HTML */ `
            <main class="main-home">
                <sc-user-info class="sc-user-info" ></sc-user-info>
                <c-posts-container class="sc-post" ></c-posts-container>
            </main>
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