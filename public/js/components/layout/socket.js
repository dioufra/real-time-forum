import { CATEGORY_CONTROLLER } from "../../controllers/categorie.js"
import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { updateComponents } from "../../script.js"

export default class Socket extends HTMLElement {
    constructor() {
        super()
        this.isSocketConnected = false
    }

    connectedCallback() {
        this.render()
        this.checkUserInfosListener()
        this.checkOnlineUsersListener()
        this.checkAllUsersListener()
        this.checkAllPostsListener()
        this.checkAllCategoriesListener()
        this.checkDisconnectListener()
    }
    disconnectedCallback() {
    }
    connectWebSocket(){
        if (!this.isSocketConnected) {
            // Créer une connexion WebSocket
            this.socket = new WebSocket("ws://localhost:8080/api/ws/",);
            // Gérer les événements de la connexion WebSocket
            this.socket.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:", event);
                this.isSocketConnected = true
                USER_CONTROLLER.IsAuth = true
                updateComponents()
            });
            this.socket.addEventListener("message", (event) => {
                let response = JSON.parse(event.data)
                // Faire un Dipach Event
                this.dispatchEvent(new CustomEvent(response.event,{detail:{data:response.data}}))
                updateComponents()
            });
            this.socket.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:", event);
                this.isSocketConnected = false
                USER_CONTROLLER.IsAuth = false
            });
            // Gérer les erreurs WebSocket
            this.socket.addEventListener("error", (event) => {
                // console.error("WebSocket error:", event);
            });
        }
    }
    checkDisconnectListener(){
        document.addEventListener('disconnectWebSocket',e => {
                fetch('/api/sign_out',{
                    method:'POST'
                }).then(response => {
                    this.socket?.close()
                    USER_CONTROLLER.disconnect()
                })
                .catch(console.log)
        })
    }
    checkUserInfosListener(){
        this.addEventListener('broadcastUserInfos',e => {
            console.log("broadcastUserInfos",e.detail.data)
            USER_CONTROLLER.setUser(e.detail.data)
        })
    }
    checkOnlineUsersListener(){
        this.addEventListener('broadcastOnlineUsers',e => {
            console.log("broadcastOnlineUsers",e.detail.data)
            USER_CONTROLLER.setOnlineUsers(e.detail.data)
        })
    }
    checkAllUsersListener(){
        this.addEventListener('broadcastAllUsers',e => {
            console.log("broadcastAllUsers",e.detail.data)
            USER_CONTROLLER.setAllUsers(e.detail.data)
        })
    }
    checkAllPostsListener(){
        this.addEventListener('broadcastAllPosts',e => {
            console.log("broadcastAllPosts",e.detail.data)
            POST_CONTROLLER.setPosts(e.detail.data)
        })
    }
    checkAllCategoriesListener(){
        this.addEventListener('broadcastAllCategories',e => {
            console.log("broadcastAllCategories",e.detail.data)
            CATEGORY_CONTROLLER.setCategories(e.detail.data)
        })
    }
    render(){
        this.connectWebSocket()
        this.innerHTML= `
            <c-header></c-header>
            <c-main></c-main>
            <c-footer></c-footer>
        `
    }
    get header() {
        this.querySelector('.main-header')
    }
}