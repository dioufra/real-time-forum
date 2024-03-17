import { ERROR_CONTROLLER } from "../controllers/error.js";
import { NOTIFICATION_CONTROLLER } from "../controllers/notification.js";
import { USER_CONTROLLER } from "../controllers/user.js"
export default class Error extends HTMLElement {
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
            ${USER_CONTROLLER.IsAuth && ERROR_CONTROLLER.display
            ? /*HTML*/
            `
                <div class="error">
                    <div><img src="//ui-avatars.com/api/?name=${ERROR_CONTROLLER.Sender}&size=30&rounded=true&color=fff&background=ff0000" alt="" />
                    </div>  
                    <div>
                    <p class="content"><span class="username">${ERROR_CONTROLLER.Sender}</span>Error</p>
                    <p class="content">${ERROR_CONTROLLER.Message}</p>
                    </div>
                </div> 
            `
            : ``
            }
        `
        if (USER_CONTROLLER.IsAuth && ERROR_CONTROLLER.display) {
            this.timer = setTimeout(() => {
                this.error?.classList.add('hidden')
                ERROR_CONTROLLER.display = false
            }, 5000);
        }
    }
    
    get error() {
        return this.querySelector('.error')
    }
}