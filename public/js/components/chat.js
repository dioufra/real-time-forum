import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { NOTIFICATION_CONTROLLER } from "../controllers/notification.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { updateSingleComponent } from "../script.js"

export default class Chat extends HTMLElement {
    constructor() {
        super()
        this.page = 1
    }
    
    connectedCallback() {
        this.render()
        this.checkCloseButtonListener()
        this.checkSubmitListener()
        this.checkScrollListener()
    }

    disconnectedCallback() {
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

        this.addEventListener('scrollend', e => {
            console.log('scroll ended');
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
        console.log(CHAT_CONTROLLER.lastMessages);
        console.log(CHAT_CONTROLLER.remainingMessages);
        console.log(CHAT_CONTROLLER.allMessages.length, CHAT_CONTROLLER.lastMessages.length + CHAT_CONTROLLER.remainingMessages.length);
        this.innerHTML = /* HTML */ `
            ${USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox ? /*HTML*/`
                <div class="chat-modal">
                    <div class="chat-header" >
                        <div class="user-infos" >
                            <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=60&rounded=true&color=fff&background=random" alt="">
                            <span class="name_container">
                                <p class="name">${CHAT_CONTROLLER.Receiver.firstname || 'firstname'} ${CHAT_CONTROLLER.Receiver.lastname || 'lastname'}</p>
                                <span class="username">@${CHAT_CONTROLLER.Receiver.username || 'username'}</span>
                            </span>
                        </div>
                        <button class="close-btn">X</button>
                    </div>
                    <div class="chat-body" >
                        ${CHAT_CONTROLLER.lastMessages.map(message => {
                        let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left'
                        if (side === 'left')
                            return `
                                    <div class="container-${side}">
                                        <div>
                                            <img class="profil-img" src="//ui-avatars.com/api/?name=${USER_CONTROLLER.FirstName + USER_CONTROLLER.LastName}&size=30&rounded=true&color=fff&background=random" alt="">
                                            <br>
                                            <span>${USER_CONTROLLER.UserName}</span>
                                        </div>
                                            <div class="message-container ${side}">
                                            <div class="message">
                                                ${message.Content}
                                            </div>
                                        </div>
                                        <span>${new Date(message.Date).toLocaleDateString('en-us', {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}</span>
                                    </div>
                                `
                        return `
                                <div class="container-${side}">
                                    <span>${new Date(message.Date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}</span>
                                    <div class="message-container ${side}">
                                        <p>${message.Content}</p>
                                    </div>
                                    <div>
                                        <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=30&rounded=true&color=fff&background=random" alt="">
                                        <br>
                                        <span>${CHAT_CONTROLLER.Receiver.username}</span>
                                    </div>
                                </div>
                            `
                        }).join('') || ""}
                    </div>
                    <div class="chat-footer" >
                        <form action="/api/message" method="post">
                            <input name="content" placeholder="Message" />
                            <button type="submit"></button>
                        </form> 
                    </div>
                </div>
            `: ``}
        `
        this.chatBody = document.querySelector('.chat-body')
        this.chatBody?.addEventListener('scrollend', e => {
            const loadgroup = CHAT_CONTROLLER.remainingMessages.slice(this.page, this.page + 10)
            const lastmessage = this.chatBody.firstElementChild
            const lastMessagePos = lastmessage.offsetTop + lastmessage.offsetHeight
            console.log(lastMessagePos);
                loadgroup.forEach(message => {
                    let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left'
                    let content
                    if (side === 'left') {
                        content = `
                            <div class="container-${side}">
                                <div>
                                    <img class="profil-img" src="//ui-avatars.com/api/?name=${USER_CONTROLLER.FirstName + USER_CONTROLLER.LastName}&size=30&rounded=true&color=fff&background=random" alt="">
                                    <br>
                                    <span>${USER_CONTROLLER.UserName}</span>
                                </div>
                                    <div class="message-container ${side}">
                                    <div class="message">
                                        ${message.Content}
                                    </div>
                                </div>
                                <span>${new Date(message.Date).toLocaleDateString('en-us', {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}</span>
                            </div>
                        `
                    } else {
                        content =  `
                            <div class="container-${side}">
                                <span>${new Date(message.Date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}</span>
                                <div class="message-container ${side}">
                                    <p>${message.Content}</p>
                                </div>
                                <div>
                                    <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=30&rounded=true&color=fff&background=random" alt="">
                                    <br>
                                    <span>${CHAT_CONTROLLER.Receiver.username}</span>
                                </div>
                            </div>
                        `
                    }
                    let msg = new DOMParser().parseFromString( content, "text/html").body.firstChild
                    this.chatBody.prepend(msg)
                })
                this.page += 10
        })
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