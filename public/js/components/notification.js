import { NOTIFICATION_CONTROLLER } from "../controllers/notification.js";
import { USER_CONTROLLER } from "../controllers/user.js"

export default class Notification extends HTMLElement {
    constructor() {
        super()
        this.timer = null
    }


    connectedCallback() {
        this.render()
    }

    

    disconnectedCallback() {
        clearTimeout(this.timer)
    }

    render() {
        this.innerHTML = /*HTML*/`
            ${USER_CONTROLLER.IsAuth && NOTIFICATION_CONTROLLER.display
            ? /*HTML*/
            `
                <div class="notification">
                    <div><img src="//ui-avatars.com/api/?name=${NOTIFICATION_CONTROLLER.Sender}&size=50&rounded=true&color=fff&background=random" alt="" />
                    </div>
                    <div>
                    <p class="content"><span class="username">${NOTIFICATION_CONTROLLER.Sender}</span> sent you a new message</p>
                    <p class="content">${NOTIFICATION_CONTROLLER.Message}</p>
                    </div>
                </div> 
            `
            : ``
            }
        `
        if (USER_CONTROLLER.IsAuth && NOTIFICATION_CONTROLLER.display) {
            this.timer = setTimeout(() => {
                this.notificationBox?.classList.add('hidden')
                NOTIFICATION_CONTROLLER.display = false
            }, 5000);
        }
    }

    get notificationBox() {
        return this.querySelector('.notification')
    }
}