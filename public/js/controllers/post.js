import { updateComponents, updateSingleComponent } from "../script.js";
import { CATEGORY_CONTROLLER } from "./categorie.js";
import { USER_CONTROLLER } from "./user.js";

class PostController {
    constructor() {
        this.allPosts = []
        this.posts = []
        this.filteredPosts = []
        this.postcreatorId = 0
        this.displayBox = false
        this.currentPostId = 0
    }
    setCurrentPostId(id){
        this.currentPostId = id
    }
    setPosts(data){
        this.allPosts = data;
        updateSingleComponent('c-posts-container')
    }

    filterByCategory(id){
        let category = CATEGORY_CONTROLLER.categories.find(c => c.Id===id)
        this.posts = this.allPosts.filter((p)=> {
            return new RegExp(category?.Name).test(p.Categories) ||id===0
        })
        updateSingleComponent('c-posts')
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