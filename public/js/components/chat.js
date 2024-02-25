import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { updateSingleComponent } from "../script.js"

export default class Chat extends HTMLElement {
    constructor() {
        super()
        this.isLoading = false
        this.chatId = ''
    }

    connectedCallback() {
        this.render()
        this.scrollTop = CHAT_CONTROLLER.scroll.top
        console.log('connected')
        console.log(this.scrollTop,this.scrollHeight)
    }

    disconnectedCallback() {
    }
    checkScrollListener(){
        this.addEventListener('scrollend',e => {
            if (!this.isLoading && e.target.scrollTop === 0) {
                CHAT_CONTROLLER.showLoader = true
                let height = this.scrollHeight
                this.isLoading = true
                // CHAT_CONTROLLER.setScroll(e.target,this.firstMessage)
                console.log('non')
                let isFltered = CHAT_CONTROLLER.filterMesages()
                if (isFltered) {
                }else{
                    CHAT_CONTROLLER.showLoader = false
                }
                updateSingleComponent('c-chat')

                // setTimeout(() => {
                    this.isLoading = false
                    // CHAT_CONTROLLER.showLoader = false
                    this.scrollTop =this.scrollHeight - height 
                    CHAT_CONTROLLER.scroll.top = this.scrollTop
                // }, 10);
            }
        })
    }

    render() {
        console.log('rendered')
        this.innerHTML = /* HTML */ `
            ${USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox? /*HTML*/`
                ${CHAT_CONTROLLER.showLoader ?`
                    <div class="chat-loader">
                        <div class="loader"></div>
                    </div>`:``
                }
                ${CHAT_CONTROLLER.filteredMessages.map(message => {
                    let side = message.ReceiverId === USER_CONTROLLER.Id ? 'left':'right'
                    let username = side === 'right'? USER_CONTROLLER.UserName:CHAT_CONTROLLER.Receiver.username
                    return `
                        <div class="container container-${side}">
                            <div>
                                <div class="message-container ${side}">
                                    <p class="username">
                                        @${username}
                                    </p>
                                    <p>${message.Content}</p>
                                </div>
                                <div class="image-container">
                                    <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=30&rounded=true&color=fff&background=random" alt="">
                                </div>
                            </div>
                            <p class="date">
                                ${new Date(message.Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"numeric", second:"numeric"})   }
                            </p>
                        </div>
                    `
                }).join('') || ""}
            `:``}
        `
        if (USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox) {
            this.checkScrollListener()
        }
    }

    get modal (){
        return this.querySelector('.chat-modal')
    }
    get messageForm() {
        return this.querySelector('form')
    }
    get header() {
        return this.querySelector('.main-header')
    }
    get chat() {
        return this.querySelector('.chat-modal')
    }
}