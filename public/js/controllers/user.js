import { navigateTo } from "../routes/routechecker.js"
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
    setUser(data){
        console.log(data)
        this.IsAuth = data.user.IsAuth || this.IsAuth
        this.FirstName = data.user.Firstname || this.FirstName
        this.LastName = data.user.Lastname || this.LastName
        this.UserName = data.user.Username || this.UserName
        this.Email = data.user.Email || this.Email
        this.Age = data.user.Age || this.Age
        this.Gender = data.user.Gender || this.Gender
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
    
    fetchData(){
        fetch('/api/getResponse')
        .then(response => response)
        .then(data => console.log(data))
        .catch(console.log)
    }
}
export const USER_CONTROLLER = new User()