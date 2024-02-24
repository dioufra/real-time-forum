import { updateComponents, updateSingleComponent } from "../script.js";
import { USER_CONTROLLER } from "./user.js";

class ChatController {
    constructor() {
        this.Receiver = {}
        this.displayBox = false
        this.SenderAdress = ""
        this.ReceiverAdress = ""
        this.allMessages = []
        this.filteredMessages = []
        this.scrollLimit = 0
        this.chatId = ''
        this.scroll={top:2000,left:0}

        this.showLoader = true
    }
    
    setReciever(receiver){
        this.Receiver = receiver
        // updateComponents()
    }

    startNewChat(senderId, receiverId){
        senderId = parseInt(senderId) || 0
        receiverId = parseInt(receiverId) || 0
        this.chatId = senderId + receiverId
        this.scroll={top:2000,left:0}
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
                // console.log(response)
                if (!response.ok) {
                    throw new Error('Erreur de réseau');
                }
                return response.json()
            })
            .then(data => {
                if (data) {
                    this.SenderAdress = data.SenderAdress
                    this.ReceiverAdress = data.ReceiverAdress
                    this.displayBox = true
                    this.showLoader = true
                    this.setReciever(receiver)
                    updateSingleComponent('c-chat-container')
                    
                    setTimeout(() => {
                        if (this.allMessages.length === 0) {
                            this.showLoader = false
                            updateSingleComponent('c-chat-container')
                        }
                    }, 2000);
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
    setAllMessages(messages){
        if (messages !== null) {
            this.allMessages = messages
            this.filterMesages()
        }
        else this.messages = []
        // updateComponents()
    }
    filterMesages(){
        this.scrollLimit += 10
        let before = this.filteredMessages.length
        this.filteredMessages = this.allMessages.filter((_,i) => {
            return i> this.allMessages.length - this.scrollLimit
        })
        let after = this.filteredMessages.length
        return before !== after
    }
    setScroll(target,firstMessage){
        let {scrollTop: top,scrollLeft: left} = target
        this.scroll ={top,left}
    }
    reset(){
        this.Receiver = {}
        this.displayBox = false
        this.SenderAdress = ""
        this.ReceiverAdress = ""
        this.allMessages = []
        this.filteredMessages = []
        this.scrollLimit = 10
        this.chatId = ''
        this.scroll={top:2000,left:0}
    }
}
export const CHAT_CONTROLLER = new ChatController()