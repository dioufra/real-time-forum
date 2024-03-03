import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { NOTIFICATION_CONTROLLER } from "../controllers/notification.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { updateSingleComponent } from "../script.js"

export default class Chat extends HTMLElement {
    constructor() {
        super()
        this.chatId = ''
        this.page = 1;
        this.throttleDelay = 300
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
        if (this.scrollTop === 0 && !this.loading) {
            const id = setTimeout(() => {
                this.loading = true
            }, 2000);
            clearTimeout(id)
            this.loading = false
            this.loadMoreMessages();
        }
    }

    // async loadMoreMessages() {
    //     try {
    //         console.log(this.page);
    //         const loadgroup = CHAT_CONTROLLER.remainingMessages.slice(this.page, this.page += 10);
    //         if (loadgroup.length === 0) return
    //         // const lastMessage = this.firstElementChild;
    //         // const lastMessagePos = lastMessage.offsetTop + lastMessage.offsetHeight;
    //         // const scrollPosition = this.scrollTop + this.clientHeight;
    //         const prevScrollHeight = this.scrollHeight; // Get the previous scroll height before adding new messages

    //         // if (scrollPosition <= lastMessagePos) {
    //         //     return
    //         // }
            

    //         console.log('loading');

    //         loadgroup.forEach(message => {
    //             let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left';
    //             let username = side === 'left' ? USER_CONTROLLER.UserName : CHAT_CONTROLLER.Receiver.username
    //             this.prepend(CHAT_CONTROLLER.parseMessage(username, message, side));
    //         });

    //         // this.page += 10;
    //         const newMessagesHeight = this.scrollHeight - prevScrollHeight;
    //         this.scrollTop += newMessagesHeight;

    //     } catch (error) {
    //         console.error("Error loading more messages:", error);
    //     } finally {
    //         this.loading = false
    //     }
    // }


    loadMoreMessages() {
        const loadgroup = CHAT_CONTROLLER.remainingMessages.slice(this.page, this.page += 10)

        if (loadgroup.length === 0) return

        const prevScrollHeight = this.scrollHeight // Get the previous scroll height before adding new messages

        loadgroup.forEach(message => {
            let side = message.ReceiverId === USER_CONTROLLER.Id ? 'right' : 'left'
            let username = side === 'left' ? USER_CONTROLLER.UserName : CHAT_CONTROLLER.Receiver.username
            this.prepend(CHAT_CONTROLLER.parseMessage(username, message, side))
        });

        const newMessagesHeight = this.scrollHeight - prevScrollHeight
        this.scrollTop += newMessagesHeight // fix scroll bar to last message position
    }

    connectedCallback() {
        this.render()
        this.addEventListener('scroll', this.debouncedScrollHandler)
    }


    disconnectedCallback() {
        this.removeEventListener('scroll ', this.debouncedScrollHandler)
    }
    

    shouldComponentRender() {
        return USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox
    }


    render() {
        this.innerHTML = /* HTML */ `
            ${USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox ? /*HTML*/`
                    ${CHAT_CONTROLLER.lastMessages.map(message => {
                        let side = message.RecieverId === USER_CONTROLLER.Id ? 'left' : 'right'
                        let username = side === 'left' ? USER_CONTROLLER.UserName : CHAT_CONTROLLER.Receiver.username
                        return /* HTML */`
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
            `
            : ``}
        `
        if (USER_CONTROLLER.IsAuth && CHAT_CONTROLLER.displayBox) {
            document.dispatchEvent(new CustomEvent('readMessages', {
                detail: {
                    senderId: CHAT_CONTROLLER.Receiver.id,
                    receiverId: USER_CONTROLLER.Id
                }
            }))
        }
        this.scrollTop = this.scrollHeight // set scroll bar to the bottom of the page
    }
}