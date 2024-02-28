import { CATEGORY_CONTROLLER } from "../../controllers/categorie.js"
import { CHAT_CONTROLLER } from "../../controllers/chat.js"
import { COMMENT_CONTROLLER} from "../../controllers/comment.js"
import { FORM_CONTROLLER } from "../../controllers/form.js"
import { NOTIFICATION_CONTROLLER } from "../../controllers/notification.js"
import { PAGE_CONTROLLER } from "../../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { verifyLocationHref } from "../../routes/routechecker.js"
import { updateSingleComponent } from "../../script.js"

export default class Socket extends HTMLElement {
    constructor() {
        super()
        this.isSocketConnected = false
    }
    
    connectedCallback() {

        this.checkAllCategoriesListener()
        this.checkUserInfosListener()
        this.checkOnlineUsersListener()
        this.checkContactedUsersListener()
        this.checkAllUsersListener()
        this.checkAllPostsListener()
        this.checkAllCategoriesListener()
        this.checkDisconnectListener()
        this.checkPostDetails()
        this.checkWebSocketConnection()
        this.checkChatListener()
        this.checkPostDetailsListener()
        this.checkAppreciation()
        this.checkMessagesReader()
        this.checkNotificationListener()
        document.dispatchEvent(new Event('connectWebSocket'))

        this.render()
    }
    disconnectedCallback() {
    }

    checkWebSocketConnection(){
        document.addEventListener('connectWebSocket',e => {
            if (!this.isSocketConnected) {
                // Créer une connexion WebSocket
                this.socket = new WebSocket("ws://"+window.location.host+"/api/ws/",);

                // Gérer les événements de la connexion WebSocket
                this.socket.addEventListener("open", (event) => {
                    // console.log("WebSocket connection opened:", event);
                    this.isSocketConnected = true
                    USER_CONTROLLER.IsAuth = true
                    PAGE_CONTROLLER.setIsLoading(false)
                });
                this.socket.addEventListener("message", (event) => {
                    let response = JSON.parse(event.data)
                    // Faire un Dipach Event
                    this.dispatchEvent(new CustomEvent(response.event,{detail:{data:response.data}}))
                    // updateComponents()
                });
                this.socket.addEventListener("close", (event) => {
                    // console.log("WebSocket connection closed:", event);
                    if (this.isSocketConnected) {
                        this.isSocketConnected = false
                        USER_CONTROLLER.disconnect()
                        PAGE_CONTROLLER.setIsLoading(false)
                    }
                });
                // Gérer les erreurs WebSocket
                this.socket.addEventListener("error", (event) => {
                    this.isSocketConnected = false
                    USER_CONTROLLER.disconnect()
                    PAGE_CONTROLLER.setIsLoading(false)
                });
            }
        })
    }
    checkDisconnectListener(){
        document.addEventListener('disconnectWebSocket',e => {
                fetch('/api/sign_out',{
                    method:'POST'
                }).then(response => {
                    this.socket?.close()
                    FORM_CONTROLLER.resetForms()
                    USER_CONTROLLER.disconnect()
                })
                .catch(console.log)
        })
    }

    checkMessagesReader() {
        document.addEventListener('readMessages', (event) => {
            // console.log(event.detail);
            this.sendData(JSON.stringify({event: "readMessages", data:event.detail}))
        })
    }
    checkAppreciation() {
        document.addEventListener('appreciation', (event) => {
            // console.log(event.detail);
            this.sendData(JSON.stringify({event: "appreciation", type: event.detail.type, component: event.detail.component,data: event.detail.data}))
        })
    }
    checkPostDetailsListener(){
        document.addEventListener('postDetails', (event) => {
            this.sendData(JSON.stringify({event: 'postDetails', type: 'postDetails', data: {postId: event.detail.data}}))
        })
    }
    checkChatListener(){
        this.addEventListener('broadcastChat',e => {
            console.log("broadcastChat",e.detail)
            const messages = e.detail.data.Message !== null ? e.detail.data.Message : []
            CHAT_CONTROLLER.setAllMessages(messages)      
            if (CHAT_CONTROLLER.chatId ===e.detail.data.ChatId)  updateSingleComponent('c-chat-container')
        })
    }
    checkUserInfosListener(){
        this.addEventListener('broadcastUserInfos',e => {
            // console.log("broadcastUserInfos",e.detail.data)
            USER_CONTROLLER.setUser(e.detail.data)
            updateSingleComponent('sc-user-info')
        })
    }
    checkOnlineUsersListener(){
        this.addEventListener('broadcastOnlineUsers',e => {
            // console.log("broadcastOnlineUsers",e.detail.data)
            USER_CONTROLLER.setOnlineUsers(e.detail.data)
            updateSingleComponent('sc-user-info')
        })
    }
    checkContactedUsersListener(){
        this.addEventListener('broadcastContactedUsers',e => {
            // console.log("broadcastAllUsers",e.detail.data)
            USER_CONTROLLER.setContactedUsers(e.detail.data)
            updateSingleComponent('sc-user-info')
        })
    }
    checkAllUsersListener(){
        this.addEventListener('broadcastAllUsers',e => {
            // console.log("broadcastAllUsers",e.detail.data)
            USER_CONTROLLER.setAllUsers(e.detail.data)
            updateSingleComponent('sc-user-info')
        })
    }
    checkAllPostsListener(){
        this.addEventListener('broadcastAllPosts',e => {
            // console.log("broadcastAllPosts",e.detail.data)
            POST_CONTROLLER.setPosts(e.detail.data)
            // updateSingleComponent('c-posts-container')
            verifyLocationHref()
        }) 
    }
    checkAllCategoriesListener(){
        this.addEventListener('broadcastAllCategories',e => {
            // console.log("broadcastAl lCategories",e.detail.data)
            CATEGORY_CONTROLLER.setCategories(e.detail.data)
            updateSingleComponent('c-filter')
        })
    }

    checkNotificationListener(){
        this.addEventListener('Notify', e => {
            // this.dispatchEvent(new CustomEvent('display-notif'))
            console.log("Notifying:", e);
            NOTIFICATION_CONTROLLER.display = true
            NOTIFICATION_CONTROLLER.setDate(e.detail.data.Message.Date)
            NOTIFICATION_CONTROLLER.setMessage(e.detail.data.Message.Content)
            NOTIFICATION_CONTROLLER.setSender(e.detail.data.Author)
            updateSingleComponent('c-notification')
        })
    }

    checkPostDetails() {
        this.addEventListener('broadcastPostDetails', e => {
            COMMENT_CONTROLLER.setData(e.detail.data.Comments, e.detail.data.Post)
            COMMENT_CONTROLLER.setIsPostSection(true)
            COMMENT_CONTROLLER.setData(e.detail.data.Comments, e.detail.data.Post)
            updateSingleComponent('c-posts-container')
            // updateComponents()
        } )
    }


    sendData(data) {
        if (this.socket)
            this.socket.send(data)
    }

    render(){
        this.innerHTML= `
            ${PAGE_CONTROLLER.isLoading?`
                <c-page-loader></c-page-loader>
            `:`
                <c-header></c-header>
                <c-modal></c-modal>
                <c-notification></c-notification>
                <c-main></c-main>
                <c-footer></c-footer>
                <c-chat-container></c-chat-container>
            `}
        `
    }
    get header() {
        this.querySelector('.main-header')
    }
}