import { updateComponents } from "../script.js";
import { USER_CONTROLLER } from "./user.js";

class ChatController {
    constructor() {
        this.Receiver = {}
        this.displayBox = false
        this.SenderAdress = ""
        this.ReceiverAdress = ""
        this.allMessages = []
    }
    
    setReciever(receiver){
        this.Receiver = receiver
        updateComponents()
    }

    startNewChat(receiverId){
        receiverId = parseInt(receiverId) || 0
        let receiver = USER_CONTROLLER.allUsers.filter(user => user.id === receiverId)[0] || null
        if(receiver){

            fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    SenderId:USER_CONTROLLER.Id,
                    ReceiverId:receiverId,
                }),
            }).then(response => {
                console.log(response)
                if (!response.ok) {
                    throw new Error('Erreur de réseau');
                }
                return response.json()
            })
            .then(data => {
                if (data) {
                    console.log("data",data)
                    this.SenderAdress = data.SenderAdress
                    this.ReceiverAdress = data.ReceiverAdress
                    this.displayBox = true
                    this.setReciever(receiver)
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    setAllMessages(messages){
        this.allMessages = messages
        updateComponents()
    }
}
export const CHAT_CONTROLLER = new ChatController()