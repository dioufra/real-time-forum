import { updateComponents } from "../script.js";

class CommentController {
    constructor() {
        this.currentCommentId = 0
        this.comments = []
        this.post = {}
        this.isPostSection = false
    }
    setData(newComments, newPost){
        if (newComments != null)
            this.comments = newComments;
        this.post = newPost
    }
    
    setIsPostSection(bool) {
        this.isPostSection = bool
    }

    setCurrentCommentId(id){
        this.currentCommentId = id
    }
}
export const COMMENT_CONTROLLER = new CommentController()