
class notificationController {
    constructor() {
        this.displayBox = false
        this.Sender = ""
        this.Message = ""
        this.date = Date.now()
    }
    
    setSender(sender){
        this.Sender = sender
    }

    setMessage(message) {
        this.Message = message
    }
    
    setDate(date) {
        this.date = data
    }
}
export const NOTIFICATION_CONTROLLER = new NotificationController()