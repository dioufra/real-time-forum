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
        // CHAT_CONTROLLER.showLoader = true
        this.scrollTop = CHAT_CONTROLLER.scroll.top
        console.log('connected')
    }

    disconnectedCallback() {
    }
    checkScrollListener(){
        this.addEventListener('scrollend',e => {
            if (!this.isLoading && e.target.scrollTop === 0) {
                CHAT_CONTROLLER.showLoader = true
                let firstMessage = this.firstMessage
                this.isLoading = true
                // CHAT_CONTROLLER.setScroll(e.target,this.firstMessage)
                let isFltered = CHAT_CONTROLLER.filterMesages()
                if (isFltered) {
                }else{
                    CHAT_CONTROLLER.showLoader = false
                }
                updateSingleComponent('c-chat-container')

                setTimeout(() => {
                    this.isLoading = false
                    CHAT_CONTROLLER.showLoader = false
                    updateSingleComponent('c-chat-container')

                    firstMessage.scrollIntoView({behavior:'smooth'})
                }, 1000);
            }
        })
    }

    render() {
        if (this) {
            this.scrollTop = CHAT_CONTROLLER.scroll.top || 2000
        }
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
    get firstMessage() {
        return this.querySelector('.chat-body .container')
    }
    get header() {
        return this.querySelector('.main-header')
    }
    get chat() {
        return this.querySelector('.chat-modal')
    }
}

// ${CHAT_CONTROLLER.filteredMessages.map(message => {
//     let side = message.ReceiverId === USER_CONTROLLER.Id?'left':'right'
//     return `
//         <div class="container container-${side}">
//             <div class="message-container ${side}">
//                 <p>${message.Content}</p>
//             </div>
//             <p class="date">
//                 ${new Date(message.Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"numeric", second:"numeric"})   }
//             </p>
//         </div>
//     `
// }).join('') || ""}

// ${CHAT_CONTROLLER.allMessages.map(message => {
//     let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left'                
//     if (side === 'left')
//         return `
//             <div class="container-${side}">
//                 <img class="profil-img" src="//ui-avatars.com/api/?name=${USER_CONTROLLER.FirstName + USER_CONTROLLER.LastName}&size=30&rounded=true&color=fff&background=random" alt="">
//                 <p class="username">${USER_CONTROLLER.UserName}</p>

//                 <div class="message-container ${side}">
//                     <p>${message.Content}</p>
//                 </div>
//             </div>
//             ${new Date(message.Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"numeric", second:"numeric"})}
//         `
//     return `
//         <div class="container-${side}">
//             <div class="message-container ${side}">
//                 <p>${message.Content}</p>
//             </div>
//             <p class="username">${CHAT_CONTROLLER.Receiver.username}</p>
//             <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=30&rounded=true&color=fff&background=random" alt="">
//         </div>
//         ${new Date(message.Date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"numeric", second:"numeric"})   }
//     `
// }).join('') || ""}