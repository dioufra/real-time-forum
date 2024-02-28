import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { NOTIFICATION_CONTROLLER } from "../controllers/notification.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
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
            

    shouldComponentRender() {
        return USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox
    }
    checkCloseButtonListener() {
        this.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON' && e.target.className === 'close-btn') {
                this.modal?.classList.add('hidden')
                CHAT_CONTROLLER.displayBox = false
            }
        })
    }

    checkScrollListener() {
        this.scrollTop = SCROLL_CONTROLLER.elements.userInfo?.scrollTop || 0
        this.chat?.addEventListener('scroll', e => {
            SCROLL_CONTROLLER.setScroll('chat', e.target)
        })
    }

    checkSubmitListener() {
        this.addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(this.messageForm)
            fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({
                    SenderAdress: CHAT_CONTROLLER.SenderAdress,
                    ReceiverAdress: CHAT_CONTROLLER.ReceiverAdress,
                    SenderId: USER_CONTROLLER.Id,
                    // Sender: `${USER_CONTROLLER.FirstName} ${USER_CONTROLLER.LastName}`,
                    ReceiverId: CHAT_CONTROLLER.Receiver.id,
                    ChatId: CHAT_CONTROLLER.chatId,
                    Content: formData.get('content'),
                }),
            }).then(async response => {
                if (!response.ok) {
                    const error = await response.json()
                    console.log(error);
                    NOTIFICATION_CONTROLLER.setMessage(`${response.statusText} : ${error.message}`)
                    NOTIFICATION_CONTROLLER.display = true
                    updateSingleComponent('c-notification')
                    throw new Error(`${response.statusText} : ${error.message}`);
                }
                return await response.json()
            }).catch(console.error);
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

    get modal() {
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