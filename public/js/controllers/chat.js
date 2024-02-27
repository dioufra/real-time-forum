import { updateComponents, updateSingleComponent } from "../script.js";
import { USER_CONTROLLER } from "./user.js";

class ChatController {
    constructor() {
        this.Receiver = {}
        this.displayBox = false
        this.SenderAdress = ""
        this.ReceiverAdress = ""
        this.allMessages = []
        this.chatId = ''
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
            }).then(response => {
                if (!response.ok) {
                    // return response.json()
                    // .then(data => {
                    //     console.log(data);
                    // })
                    console.log(response.status);
                    throw new Error('Erreur de réseau');
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
        if (messages !== null) this.allMessages = messages
        else this.messages = []
        // updateComponents()
    }
}
export const CHAT_CONTROLLER = new ChatController()