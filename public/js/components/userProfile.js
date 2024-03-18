import { USER_CONTROLLER } from "../controllers/user.js";

export default class OnlineUserList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
        
    }

    render() {
        this.innerHTML = /* HTML */`
            <a href="/user">
                <div class="profil-photo">
                    <img src="//ui-avatars.com/api/?name=${USER_CONTROLLER.UserName}&size=100&rounded=true&color=fff&background=random"alt="">
                </div>
            </a>
            <p class="user-name">${USER_CONTROLLER.FirstName} ${USER_CONTROLLER.LastName}</p>
            <div class="dcn-btn">
                <a href="/logout">Logout</a href="">
            </div>
            <div class="user-ac">
                <div id="show-modal" style="cursor:pointer;">New Post</div> 
            </div>
        `
    }
}