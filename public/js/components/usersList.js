import { USER_CONTROLLER } from "../controllers/user.js";

export default class UsersList extends HTMLElement {
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
                        <p>
                            <br/>
                            ${user.unread_mesages > 0?`
                                <span class="unread-messages">${user.unread_mesages}</span>
                            `:``
                            }
                        </p>
                    </div>
                </div>
            </button>  
        `).join('') || '<p class="no-user">No user found</p>'}
        `
    }
}