import { CATEGORY_CONTROLLER } from "../../controllers/categorie.js"
import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"
import { ROUTER } from "../../routes/routes.js"
import {API_SERVICE} from "../../service/api-service.js"

export default class Main extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
       

        this.registerUser = (event) => {
            API_SERVICE.registerUser(event.detail.user)
        }
        this.loginUser = (event) => {
            if (!event.detail.user) return;
        
            API_SERVICE.loginUser(event.detail.user)
                .then(data => {
                    this.isAuth = data.user.IsAuth
                    USER_CONTROLLER.setIsAuth(data.user.IsAuth)
                    USER_CONTROLLER.setUser(data)
                    POST_CONTROLLER.setPosts(data.posts)
                    CATEGORY_CONTROLLER.setCategories(data.categories)
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
        this.logoutBtn?.addEventListener('click', this.logout)
    }

    disconnectedCallback() {
        console.log('disconnected main')
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        console.log('rendering', ROUTER.currentRoute);
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
                    `
                    ${ROUTER.currentRoute === '/login' ?
                        `<c-login class="form-f"></c-login>`
                    :
                    `
                    <div class="left-des">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem dolorem eveniet quaerat maxime accusantium q</p>
                    <div class="auth-btns">
                        <a href="/register" class="sbcr">Register</a>
                        <a href="/login" class="join">Join us</a>
                    </div>
                    </div>
                    `
                    }
                    `
                    }
                    <div class="rigth-des">
                        <div class="rigth-content">Join us <br> share <br>enjoy</div>
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
        }`
    }

    get header() {
        this.querySelector('.main-header')
    }

    get form() {
        return this.querySelector('form')
    }
}