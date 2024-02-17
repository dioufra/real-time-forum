import { USER_CONTROLLER } from "../controllers/user.js"

export default class Notification extends HTMLElement {
    constructor() {
        super()
        this.timer = null

        this.displayListener = (event) => {
            console.log('I have been triggered');
            this.render()
            this.timer = setTimeout(() => {
                this.remove()
            }, 1000)
        }

    }


    connectedCallback() {
        this.addEventListener('display-notif', this.displayListener)
    }

    

    disconnectedCallback() {
        clearTimeout(this.timer)
        this.removeEventListener('display-notif', this.displayListener)
    }

    render() {
        this.innerHTML = /*HTML*/`
            ${USER_CONTROLLER.IsAuth
            ? /*HTML*/
            `
                <div class="notification">
                    <div><img src="//ui-avatars.com/api/?name=Francois Pape&size=50&rounded=true&color=fff&background=random" alt="" />
                    </div>
                    <div>
                    <p><span class="username">Francois Pape</span> sent you a new message</p>
                    </div>
                </div> 
            `
            : ``
            }
        `
    }
}