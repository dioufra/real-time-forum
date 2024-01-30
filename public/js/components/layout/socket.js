import { POST_CONTROLLER } from "../../controllers/post.js"
import { USER_CONTROLLER } from "../../controllers/user.js"
import { updateComponents } from "../../script.js"

export default class Socket extends HTMLElement {
    constructor() {
        super()
        this.isSocketConnected = false
        this.storedData = []
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        this.checkOnlineUsersListener()
        this.checkAllUsersListener()
        this.checkAllPostsListener()
    }
    disconnectedCallback() {
        console.log('disconnected')
    }
    connectWebSocket(){
        if (!this.isSocketConnected) {
            // Créer une connexion WebSocket
            const socket = new WebSocket("ws://localhost:8080/api/ws/",);
            // Gérer les événements de la connexion WebSocket
            socket.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:", event);
                this.isSocketConnected = true
                USER_CONTROLLER.IsAuth = true
                updateComponents()
            });
            socket.addEventListener("message", (event) => {
                let response = JSON.parse(event.data)
                // Mettre à jour le storedData
                this.storedData = response.data
                this.dispatchEvent(new Event(response.event))
                updateComponents()
            });
            socket.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:", event);
                this.isSocketConnected = false
                USER_CONTROLLER.IsAuth = false
            });
            // Gérer les erreurs WebSocket
            socket.addEventListener("error", (event) => {
                console.error("WebSocket error:", event);
            });
        }
    }
    checkOnlineUsersListener(){
        this.addEventListener('broadcastOnlineUsers',e => {
            console.log("broadcastOnlineUsers",this.storedData)
            USER_CONTROLLER.setOnlineUsers(this.storedData)
        })
    }
    checkAllUsersListener(){
        this.addEventListener('broadcastAllUsers',e => {
            console.log("broadcastAllUsers",this.storedData)
            USER_CONTROLLER.setAllUsers(this.storedData)
        })
    }
    checkAllPostsListener(){
        this.addEventListener('broadcastAllPosts',e => {
            console.log("broadcastAllPosts",this.storedData)
            POST_CONTROLLER.setPosts(this.storedData)
        })
    }
    render(){
        this.connectWebSocket()
        this.innerHTML= `
            <c-header>  </c-header>
            <c-main id="myElement"></c-main>
        `
    }
    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}