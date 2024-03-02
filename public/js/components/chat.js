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
        this.page = 1;
        this.throttleDelay = 300; // Milliseconds delay for debouncing
        this.debouncedScrollHandler = this.debounce(this.handleScroll, this.throttleDelay);
    }

    

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    handleScroll() {
        this.loadMoreMessages();
        // if (this.scrollTop === 0 && !this.loading) {
        // }
    }

    async loadMoreMessages() {
        try {
            this.loading = true; // Set loading flag to true to prevent multiple simultaneous loading
            const loadgroup = CHAT_CONTROLLER.remainingMessages.slice(this.page, this.page + 10);
            const lastMessage = this.firstElementChild;
            const lastMessagePos = lastMessage.offsetTop + lastMessage.offsetHeight;
            const scrollPosition = this.scrollTop + this.clientHeight;

            if (scrollPosition <= lastMessagePos) {
                return; // Return if the scroll position is not at the bottom
            }

            loadgroup.forEach(message => {
                let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left';
                let username = side === 'left' ? USER_CONTROLLER.UserName : CHAT_CONTROLLER.Receiver.username
                let content = `
                        <div class="container container-${side}">
                            <div>
                                <div class="message-container ${side}">
                                    <p class="username">
                                        @${username}
                                    </p>
                                    <p>${message.Content}</p>
                                </div>
                                <div class="image-container">
                                    <img class="profil-img" src="//ui-avatars.com/api/?name=${username}&size=30&rounded=true&color=fff&background=random" alt="">
                                </div>
                            </div>
                            <p class="date">
                                ${new Date(message.Date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}
                            </p>
                        </div>
                    `
                ;
                let msg = new DOMParser().parseFromString(content, "text/html").body.firstChild;
                this.prepend(msg);
            });
            this.page += 10;
        } catch (error) {
            console.error("Error loading more messages:", error);
        } finally {
            this.loading = false; // Reset loading flag after loading is completed
        }
    }

    connectedCallback() {
        this.render()
        this.addEventListener('scrollend', this.debouncedScrollHandler)
    }


    disconnectedCallback() {
        this.removeEventListener('scrollend ', this.debouncedScrollHandler)
    }
    

    shouldComponentRender() {
        return USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox
    }
    render() {
        this.scrollTop = this.scrollHeight
        this.innerHTML = /* HTML */ `
            ${USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox ? /*HTML*/`
                ${CHAT_CONTROLLER.showLoader ? `
                    <div class="chat-loader">
                        <div class="loader"></div>
                    </div>`: ``
                }
                ${CHAT_CONTROLLER.lastMessages.map(message => {
                    let side = message.RecieverId === USER_CONTROLLER.Id ? 'left' : 'right'
                    let username = side === 'left' ? USER_CONTROLLER.UserName : CHAT_CONTROLLER.Receiver.username
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
                                    <img class="profil-img" src="//ui-avatars.com/api/?name=${username}&size=30&rounded=true&color=fff&background=random" alt="">
                                </div>
                            </div>
                            <p class="date">
                                ${new Date(message.Date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric", second: "numeric" })}
                            </p>
                        </div>
                    `
                }).join('') || ""}
            `: ``}
        `
        if (USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox) {
            // this.checkScrollListener()
            document.dispatchEvent(new CustomEvent('readMessages', {
                detail: {
                    senderId: CHAT_CONTROLLER.Receiver.id,
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