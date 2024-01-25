import { CATEGORY_CONTROLLER } from "../../controllers/categorie.js"
import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import login_data from "../../json_data/user_data.js"
import { navigateTo } from "../../routes/routechecker.js"
import { ROUTER } from "../../routes/routes.js"

export default class Main extends HTMLElement {
    constructor() {
        super()
        // this.submitFormListerner = (e) => {
        //     e.preventDefault();
        // }
        this.registerUser = (event) => {
            if (!event.detail.user) return
            fetch('http://127.0.0.1:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            fetch('http://127.0.0.1:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                // login data imported fron json_data
                if (login_data) {
                    USER_CONTROLLER.setUser(login_data.UserData)
                    POST_CONTROLLER.setPosts(login_data.Posts)
                    CATEGORY_CONTROLLER.setCategories(login_data.Categories)
                    CATEGORY_CONTROLLER.setCurrentCategoryId(login_data.CurrentCategoryId)
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
            </main> `
                : /* HTML if Ahthentificated */ `
            <sc-user-info class="sc-user-info" ></sc-user-info>
            <c-posts-container class="sc-post" ></c-posts-container>
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