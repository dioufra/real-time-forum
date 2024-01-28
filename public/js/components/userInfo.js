import { USER_CONTROLLER } from "../controllers/user.js"

export default class UserInfo extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        // this._style()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
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
                    <a href="/">Disconnet </a href="">
                </div>
            </div>
            <div class="user-ac">
                <div id="show-modal" style="cursor:pointer;">New Post</div>
                <div class="user-ac">
                    <div><a href="/created">Created posts</a></div>
                    <div><a href="/liked">Liked posts</a></div>
                </div>
            </div>
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}