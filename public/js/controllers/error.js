
class ErrorController {
    constructor() {
        this.display = false
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
        this.date = date
    }

    reset() {
        this.Sender = ''
        this.message = ''
        this.display = false
    }
}
export const ERROR_CONTROLLER = new ErrorController()