import { updateComponents, updateSingleComponent } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
        this.filteredPosts = []
        this.postcreatorId = 0
        this.displayBox = false
    }
    setPosts(data){
        this.posts = data;
        // updateComponents()
        updateSingleComponent('c-posts-container')
    }

    addNewPost(user_id) {
        this.displayBox = true
        this.postcreatorId = user_id || this.postcreatorId
        updateSingleComponent('c-modal')
    }
    hideBox() {
        this.displayBox = false
        this.postcreatorId = 0
        updateSingleComponent('c-modal')
    }    
}
export const POST_CONTROLLER = new PostController()