import { navigateTo } from "../routes/routechecker.js"
import { updateComponents, updateSingleComponent } from "../script.js"

class User {
    constructor() {
        this.Id = 0
        this.IsAuth = true
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
        this.Age = ''
        this.Gender = ''
        // Data from wesocket
        this.onlineUsers = []
        this.allUsers = []
    }
    setOnlineUsers(data){this.onlineUsers = data}
    setAllUsers(data){this.allUsers = data}
    setIsAuth(bool){
        this.IsAuth = bool
        // updateComponents()
    }
    setUser(user){
        this.Id = user.id || this.Id
        this.IsAuth = user.IsAuth || this.IsAuth
        this.FirstName = user.firstname || this.FirstName
        this.LastName = user.lastname || this.LastName
        this.UserName = user.username || this.UserName
        this.Email = user.email || this.Email
        this.Age = user.age || this.Age
        this.Gender = user.gender || this.Gender
        // updateComponents()
        updateSingleComponent('sc-user-info')
    }
    disconnect(){
        this.Id = 0
        this.IsAuth = false
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
        this.Age = ''
        this.Gender = ''

        updateComponents()
    }
}
export const USER_CONTROLLER = new User()