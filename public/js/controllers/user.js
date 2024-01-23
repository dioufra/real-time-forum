import { navigateTo } from "../routes/routechecker.js"
import { ROUTES_CONTROLLER } from "../routes/routes.js"
import { updateComponents } from "../script.js"

class User {
    constructor() {
        this.IsAuth = false
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
        this.Age = ''
        this.Gender = ''
    }
    setIsAuth(bool){
        this.IsAuth = bool
        updateComponents()
    }
    setUser({IsAuth,FirstName,LastName,UserName,Email,Age,Gender}){
        this.IsAuth = IsAuth || this.IsAuth
        this.FirstName = FirstName || this.FirstName
        this.LastName = LastName || this.LastName
        this.UserName = UserName || this.UserName
        this.Email = Email || this.Email
        this.Age = Age || this.Age
        this.Gender = Gender || this.Gender
        updateComponents()
    }
    disconnect(){
        this.IsAuth = false
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
        this.Age = ''
        this.Gender = ''

        navigateTo('login')
        updateComponents()
    }
}
export const USER_CONTROLLER = new User()