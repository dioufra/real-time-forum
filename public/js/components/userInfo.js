import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { navigateTo } from "../routes/routechecker.js"

export default class UserInfo extends HTMLElement {
    constructor() {
        super()
        this.scrollTop = 0
    }

    connectedCallback() {
        this.render()
        this.checkButtonClickListener()
        this.checkScrollListener()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    checkScrollListener(){
        this.scrollTop = SCROLL_CONTROLLER.elements.userInfo?.scrollTop || 0
        this.addEventListener('scroll',e => {
            SCROLL_CONTROLLER.setScroll('userInfo',e.target)
        })
    }

    checkButtonClickListener(){
        this.addEventListener('click', function (event) {
            const { target } = event
            if (target.tagName === 'A' ) {
                event.preventDefault();
                if (target.href.split('/').reverse()[0] === 'logout') {
                    document.dispatchEvent(new Event('disconnectWebSocket'))
                    navigateTo(target.href);
                }
            } else {
                if (target.getAttribute('id') === 'show-modal') {
                    POST_CONTROLLER.addNewPost()
                }else if (target.tagName === 'BUTTON') {
                    let userId = parseInt(target.getAttribute('userId'))
                    if (userId) {
                        console.log('Starting a new chat: ', userId);
                        CHAT_CONTROLLER.startNewChat(USER_CONTROLLER.Id, userId)
                    }
                }
            }
        });
    }

    render() {
        this.innerHTML = /* HTML */ `
            <c-profile class="profil"></c-profile>
            <c-discussion-list class="users-list"></c-discussion-list>
            <c-online-users-list class="users-list"></c-online-users-list>
            <c-users-list class="users-list"></c-users-list>
        `
    }

    get header() {
        this.querySelector('.main-header')
    }

    get displayModalBtn() {
        return this.querySelector('.show-modal')
    }
}