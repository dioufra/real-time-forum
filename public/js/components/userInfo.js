import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { navigateTo } from "../routes/routechecker.js"
import { updateComponents, updateSingleComponent } from "../script.js"

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
                    console.log('rendering post modal');
                    POST_CONTROLLER.addNewPost()
                }else if (target.tagName === 'BUTTON') {
                    let userId = parseInt(target.getAttribute('userId'))
                    if (userId) {
                        CHAT_CONTROLLER.startNewChat(USER_CONTROLLER.Id, userId)
                    }
                }
            }
        });
    }

    render() {
        this.innerHTML = /* HTML */ `
            <div class="profil">
                <a href="/user">
                    <div class="profil-photo">
                        <img src="//ui-avatars.com/api/?name=${USER_CONTROLLER.FirstName} ${USER_CONTROLLER.LastName}&size=100&rounded=true&color=fff&background=random"alt="">
                    </div>
                </a>
                <p class="user-name">${USER_CONTROLLER.FirstName} ${USER_CONTROLLER.LastName}</p>
                <div class="dcn-btn">
                    <a href="/logout">Logout</a href="">
                </div>
            </div>
            <div class="user-ac">
                <div id="show-modal" style="cursor:pointer;">New Post</div>
                <div class="user-ac">
                    <div><a href="/created">Created posts</a></div>
                    <div><a href="/liked">Liked posts</a></div>
                </div>
            </div>
            <div class="users-list">
                <label>Online Users</label>
                ${USER_CONTROLLER.onlineUsers.map(user => `
                    <button class="user" userId="${user.id}">
                        <img src="//ui-avatars.com/api/?name=${user.username}&size=60&rounded=true&color=fff&background=random" alt="" />
                        <div>
                            <div>
                                <p>
                                    ${user.firstname} ${user.lastname}
                                    <br/>
                                    <span>@${user.username}</span>
                                </p>
                                <span>Just Now</span>
                            </div>
                        </div>
                    </button>
                `).join('') || '<p class="no-user">No user online</p>'}
            </div>
            <div class="users-list">
                <label >All Users</label>
                ${USER_CONTROLLER.allUsers.map(user => `
                    <button class="user" userId="${user.id}">
                        <img src="//ui-avatars.com/api/?name=${user.username}&size=60&rounded=true&color=fff&background=random" alt="" />
                        <div>
                            <div>
                                <p>
                                    ${user.firstname} ${user.lastname}
                                    <br/>
                                    <span>@${user.username}</span>
                                </p>
                                <span>Just Now</span>
                            </div>
                        </div>
                    </button>  
                `).join('') || '<p class="no-user">No user found</p>'}
            </div>
        `
    }

    get header() {
        this.querySelector('.main-header')
    }

    get displayModalBtn() {
        return this.querySelector('.show-modal')
    }
}