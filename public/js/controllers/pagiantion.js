import { verifyLocationHref } from "../routes/routechecker.js";
import { POST_CONTROLLER } from "./post.js";

class PaginationController {
    constructor() {
        this.PageSize = 5
        this.CurrentPage = 1
        this.isLoading = true
    }
    setCurrentPage(page){
        console.log(page);
        this.CurrentPage = page
        POST_CONTROLLER.filteredPosts = POST_CONTROLLER.posts.filter((post,index)=> {
            return index >= (page - 1) * this.PageSize && index < (page *  this.PageSize)
        })
    }
    setIsLoading(bool){
        setTimeout(() => {
            this.isLoading = bool
            verifyLocationHref()
            // updateComponents()
        }, 1000);
    }
}
export const PAGE_CONTROLLER = new PaginationController()