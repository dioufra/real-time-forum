import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"

export default class Header extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.checkButtonClickListener()
        this.render()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkButtonClickListener(){
        // Handle navigation when a link is clicked
        this.addEventListener('click', function (event) {
            if (event.target.tagName === 'A' ) {
                event.preventDefault();
                if (event.target.href.split('/').reverse()[0] === 'logout') {
                    document.dispatchEvent(new Event('disconnectWebSocket'))
                    navigateTo('/login');
                }else{
                    navigateTo(event.target.href);
                }
            }
        });
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

    get header() {
        this.querySelector('.main-header')
    }
}