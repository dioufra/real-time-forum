import { updateComponents, updateSingleComponent } from "../script.js";
import { NOTIFICATION_CONTROLLER } from "./notification.js";
import { USER_CONTROLLER } from "./user.js";

class ChatController {
    constructor() {
        this.Receiver = {}
        this.displayBox = false
        this.SenderAdress = ""
        this.ReceiverAdress = ""
        this.allMessages = []
        this.chatId = ''
        this.lastMessages = []
        this.remainingMessages = []
    }
    
    setReciever(receiver){
        this.Receiver = receiver
        // updateComponents()
    }

    startNewChat(senderId, receiverId){
        senderId = parseInt(senderId) || 0
        receiverId = parseInt(receiverId) || 0
        this.chatId = senderId + receiverId
        let receiver = USER_CONTROLLER.allUsers.filter(user => user.id === receiverId)[0] || null
        if(receiver){

            fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    SenderId:USER_CONTROLLER.Id,
                    ReceiverId:receiverId,
                    ChatId: CHAT_CONTROLLER.chatId
                }),
            }).then(async response => {
                if (!response.ok) {
                    console.log(response);
                    const error = await response.json()
                    NOTIFICATION_CONTROLLER.setMessage(`${response.statusText} : ${error.message}`)
                    NOTIFICATION_CONTROLLER.display = true
                    updateSingleComponent('c-notification')
                    throw new Error(`${response.statusText} : ${error.message}`);
                }
                return response.json()
            })
            .then(data => {
                if (data) {
                    this.SenderAdress = data.SenderAdress
                    this.ReceiverAdress = data.ReceiverAdress
                    this.displayBox = true
                    this.setReciever(receiver)
                    updateSingleComponent('c-chat-container')
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    setAllMessages(messages){
        if (messages !== null) {
            this.allMessages = messages.reverse()
            this.lastMessages = this.allMessages.slice(0, 10)
            this.remainingMessages = this.allMessages.slice(10)
        }
        else this.messages = []
        // updateComponents()
    }
}
export const CHAT_CONTROLLER = new ChatController()