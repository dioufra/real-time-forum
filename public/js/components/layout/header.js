import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"

export default class Header extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
            this.logout = event => {
                USER_CONTROLLER.setIsAuth(false)
                // Implement your logout logic here
                // You might want to dispatch a custom event for logout or perform other actions
                fetch('/api/logout')
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 400) {
                                const error = response.json()
                                console.log(error)
                            } else {
                                throw new Error('Network error')
                            }
                        }
                        return response
                        
                    }).catch(error => {
                        console.error(error);
                        throw error;
                    })
                    navigateTo('login')
            }
    }

    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
        // Remove event listener or perform cleanup if needed
        if (this.logoutBtn) {
            this.logoutBtn.removeEventListener('click', this.logout);
        }
    }

    shouldComponentRender() {
        console.log(this.innerHTML)
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
            <header>
                <div class="main-header">
                    <div class="logo" >
                        <a href="/">     
                            <img src="../../../public/img/LOGO.png" alt="bg-image">
                        </a>
                    </div>
                
                    <div class="links">
                        ${USER_CONTROLLER.IsAuth
                ? /* HTML */
                `<a id="logout" class="logout">Logout</a>`
                : /* HTML */
                `
                            <a href="/register" class="sbcr">Register</a>
                            <a href="/login" class="join">Join us</a>
                        `
            }   
                    </div>
                </div>
            </header>
        `;

        if (USER_CONTROLLER.IsAuth) {
            this.logoutBtn.addEventListener('click', this.logout);
        }
    }

    get logoutBtn() {
        console.log(this.querySelector('a#logout'));
        return this.querySelector('a#logout')
    }

}
