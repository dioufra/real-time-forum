import { updateComponents } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
    }
    setPosts(newPosts){
        this.posts = newPosts;
        updateComponents()
    }
}
export const POST_CONTROLLER = new PostController()