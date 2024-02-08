import { POST_CONTROLLER } from "./post.js";

class PaginationController {
    constructor() {
        this.PageSize = 5
        this.CurrentPage = 1
    }
    setCurrentPage(page){
        this.CurrentPage = page
        POST_CONTROLLER.filteredPosts = POST_CONTROLLER.posts.filter((post,index)=> {
            return index >= (page - 1) * this.PageSize && index < (page *  this.PageSize)
        })
    }
}
export const PAGINATION_CONTROLLER = new PaginationController()