import { updateComponents } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
        this.filteredPosts = []
        this.postcreatorId = 0
        this.displayBox = false
    }
    setPosts(data){
        this.posts = data;
        updateComponents()
    }

    addNewPost(user_id) {
        this.displayBox = true
        this.postcreatorId = user_id || this.postcreatorId
    }

    
}
export const POST_CONTROLLER = new PostController()