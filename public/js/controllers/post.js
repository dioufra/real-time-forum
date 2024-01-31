import { updateComponents } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
        this.filteredPosts = []
    }
    setPosts(data){
        this.posts = data;
        updateComponents()
    }
}
export const POST_CONTROLLER = new PostController()