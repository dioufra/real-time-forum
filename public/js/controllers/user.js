import { updateComponents } from "../script.js"

class User {
    constructor() {
        this.IsAuth = false
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
    }
    setIsAuth(bool){
        this.IsAuth = bool
        updateComponents()
    }
}
export const USER_CONTROLLER = new User()