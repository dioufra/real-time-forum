import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { updateSingleComponent } from "../script.js"

export default class Chat extends HTMLElement {
    constructor() {
        super()
        this.isLoading = false
        this.chatId = ''
        this.isMounted = false
    }

    connectedCallback() {
        this.render()
        this.scrollTop = CHAT_CONTROLLER.scroll.top
        this.isMounted = false
        setTimeout(() => {
            this.isMounted = true
        }, 500);
    }

    disconnectedCallback() {
    }
    checkScrollListener(){
        this.addEventListener('scrollend',e => {
            
            CHAT_CONTROLLER.scroll.top = this.scrollTop
            if (!this.isLoading && this.scrollTop < 70 && this.isMounted) {
                CHAT_CONTROLLER.showLoader = true
                let height = this.scrollHeight
                this.isLoading = true
                // CHAT_CONTROLLER.setScroll(e.target,this.firstMessage)
                let isFltered = CHAT_CONTROLLER.filterMesages()
                if (isFltered) {
                }else{
                    CHAT_CONTROLLER.showLoader = false
                }
                updateSingleComponent('c-chat')

                // setTimeout(() => {
                    this.isLoading = false
                    this.scrollTop =this.scrollHeight - height 
                    CHAT_CONTROLLER.scroll.top = this.scrollTop
                // }, 10);
            }
        })
    }

    render() {
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
            document.dispatchEvent(new CustomEvent('readMessages',{
                detail:{
                    senderId:CHAT_CONTROLLER.Receiver.id,
                    receiverId: USER_CONTROLLER.Id
                }
            }))
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