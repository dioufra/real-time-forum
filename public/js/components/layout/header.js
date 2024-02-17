import { COMMENT_CONTROLLER } from "../../controllers/comment.js"
import { PAGE_CONTROLLER } from "../../controllers/pagiantion.js"
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
            event.preventDefault();
            if (event.target.tagName === 'A' ) {
                if (event.target.href.split('/').reverse()[0] === 'logout') {
                    document.dispatchEvent(new Event('disconnectWebSocket'))
                    navigateTo('/login');
                }else{
                    PAGE_CONTROLLER.setCurrentPage(1)
                    COMMENT_CONTROLLER.isPostSection = false
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
                        <a href="/page=1">     
                            <img src="/img/LOGO.png"  alt="bg-image">
                        </a>
                    </div>
                
                    <div class="links">
                        ${USER_CONTROLLER.IsAuth? /*HTML */ 
                            `<a href="/logout" class="logout">Logout</a>`
                        : /* HTML */`
                            <a href="/register" class="sbcr">Register</a>
                            <a href="/login" class="join">Join us</a>
                        `}   
                    </div>
                </div>
            </header>
        `
    }

    get header() {
        this.querySelector('.main-header')
    }
}