import { updateComponents } from "../script.js";

class PostController {
    constructor() {
        this.posts = []
    }
    setPosts(data){
        this.posts = data;
        this.posts.forEach(_data => console.log(_data.Post))
        updateComponents()
    }
}
export const POST_CONTROLLER = new PostController()