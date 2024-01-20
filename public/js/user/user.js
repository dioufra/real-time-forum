import { updateComponents } from "../script.js"

class User {
    constructor() {
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''

        this.forms = {}
    }
    setError(action,err){
        this.forms[action].error = err
        updateComponents()
    }
    updateForm(action,property,value){
        this.forms[action][property] = value
    }
}
export const CURRENT_USER = new User()