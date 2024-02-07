
import { FORM_CONTROLLER } from "../../controllers/form.js"
import { SCROLL_CONTROLLER } from "../../controllers/scroll.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"
import {API_SERVICE} from "../../service/api-service.js"

export default class Main extends HTMLElement {
    constructor() {
        super()
        this.registerUser = (event) => {
            API_SERVICE.registerUser(event.detail.user)
            .then(data => {
                console.log(data);
                if (data) {
                    console.log(data)
                    // Redirect to login page
                    FORM_CONTROLLER.resetForms()
                    FORM_CONTROLLER.resetErrors()
                    navigateTo('login')
                }
            }).catch(console.log);
        }
        this.loginUser = (event) => {
            if (!event.detail.user) return;
        
            API_SERVICE.loginUser(event.detail.user)
                .then(data => {
                    if (data) {
                        document.dispatchEvent(new Event('connectWebSocket'))
                        FORM_CONTROLLER.resetForms()
                        FORM_CONTROLLER.resetErrors()
                        navigateTo('/page=1')
                    }
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
        this.checkScrollListener()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkScrollListener(){
        this.scrollTop = SCROLL_CONTROLLER.elements.main?.scrollTop || 0
        this.addEventListener('scroll',e => {
            SCROLL_CONTROLLER.setScroll('main',e.target)
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
        ${!USER_CONTROLLER.IsAuth ? /* HTML */ ` 
            <c-auth></c-auth>
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