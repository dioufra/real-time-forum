import { updateComponents, updateSingleComponent } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
        this.filteredPosts = []
    }
    setPosts(data){
        this.posts = data;
        // updateComponents()
        updateSingleComponent('c-posts-container')
    }
}
export const POST_CONTROLLER = new PostController()