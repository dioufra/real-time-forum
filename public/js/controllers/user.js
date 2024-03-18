import { updateComponents } from "../script.js"
import { CHAT_CONTROLLER } from "./chat.js"

class UserController {
    constructor() {
        this.Id = 0
        this.IsAuth = false
        this.FirstName = ''
        this.LastName = ''
        this.UserName = ''
        this.Email = ''
        this.Age = ''
        this.Gender = ''
        // Data from wesocket
        this.contactedUsers = []
        this.onlineUsers = []
        this.allUsers = []
    }
    setContactedUsers(data){this.contactedUsers = this.filterUsers(data)}
    setOnlineUsers(data){this.onlineUsers = this.filterUsers(data)}
    setAllUsers(data){this.allUsers = this.filterUsers(data)}
    setIsAuth(bool){
        this.IsAuth = bool
    }
    filterUsers(array) {
        try {
            return array.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.id === obj.id
                ))
            );
        } catch (error) {
            return []
        }
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
        CHAT_CONTROLLER.reset()

        updateComponents()
    }
}
export const USER_CONTROLLER = new UserController()