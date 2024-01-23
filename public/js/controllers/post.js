import { updateComponents } from "../script.js";

class PostController {
    constructor() {
        this.posts = [
            { //just an exemple
                Id:0,
                User:{
                    UserName : '',
                },
                Title:'',
                Content:``,
                Image:'https://picsum.photos/200',
                Categories: [""],
                Date: new Date()
            },
        ]
    }
    setPosts(newPosts){
        this.posts = newPosts;
        updateComponents()
    }
}
export const POST_CONTROLLER = new PostController()