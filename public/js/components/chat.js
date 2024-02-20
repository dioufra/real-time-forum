import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"

export default class Chat extends HTMLElement {
    constructor() {
        super()
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
    checkCloseButtonListener(){
        this.addEventListener('click',e => {
            if (e.target.tagName === 'BUTTON' && e.target.className === 'close-btn') {
                this.modal?.classList.add('hidden')
                CHAT_CONTROLLER.displayBox = false
            }
        })
    }

    checkScrollListener(){
        this.scrollTop = SCROLL_CONTROLLER.elements.userInfo?.scrollTop || 0
        this.chat?.addEventListener('scroll',e => {
            SCROLL_CONTROLLER.setScroll('chat',e.target)
        })
    }

    checkSubmitListener(){
        this.addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(this.messageForm)
            fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({
                    SenderAdress:CHAT_CONTROLLER.SenderAdress,
                    ReceiverAdress:CHAT_CONTROLLER.ReceiverAdress,
                    SenderId:USER_CONTROLLER.Id,
                    ReceiverId:CHAT_CONTROLLER.Receiver.id,
                    ChatId: CHAT_CONTROLLER.chatId,
                    Content:formData.get('content'),
                    Date: Date.now()
                }),
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                        .then(error => {
                            console.log(error.message)
                            FORM_CONTROLLER.setError('message',error.message)
                        })
                        return
                    } else {
                        throw new Error('Erreur de réseau');
                    }
                }
                return response.json()
            })
            .then(data => {
                if (data) {
                    // console.log('data',data)
                }
            })
            .catch(console.error);
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
            ${USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox? /*HTML*/`
                <div class="chat-modal">
                    <div class="chat-header" >
                        <div class="user-infos" >
                            <img class="profil-img" src="//ui-avatars.com/api/?name=${CHAT_CONTROLLER.Receiver.username}&size=60&rounded=true&color=fff&background=random" alt="">
                            <span class="name_container">
                                <p class="name">${CHAT_CONTROLLER.Receiver.firstname||'firstname'} ${CHAT_CONTROLLER.Receiver.lastname||'lastname'}</p>
                                <span class="username">@${CHAT_CONTROLLER.Receiver.username || 'username'}</span>
                            </span>
                        </div>
                        <button class="close-btn">X</button>
                    </div>
                    <div class="chat-body" >
                        ${CHAT_CONTROLLER.allMessages.map(message => {
                            let side = message.ReceiverId === USER_CONTROLLER.Id?'left':'right'
                            return `date
                            <div class="container-${side}">
                                <div class="message-container ${side}">
                                    <p>${message.Content}</p>
                                </div>
                            </div>`
                        }).join('') || ""}
                    </div>
                    <div class="chat-footer" >
                        <form action="/api/message" method="post">
                            <input name="content" placeholder="Message" />
                            <button type="submit"></button>
                        </form> 
                    </div>
                </div>
            `:``}
        `
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