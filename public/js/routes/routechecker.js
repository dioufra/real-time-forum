import { COMMENT_CONTROLLER } from "../controllers/comment.js";
import { PAGINATION_CONTROLLER } from "../controllers/pagiantion.js";
import { POST_CONTROLLER } from "../controllers/post.js";
import { USER_CONTROLLER } from "../controllers/user.js";
import { updateComponents, updateSingleComponent } from "../script.js";
import { ROUTER } from "./routes.js";

// Route change listener
document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    // navigateTo(ROUTER.currentRoute)
    
    // Handle navigation on back/forward button click
    window.addEventListener('popstate', function () {
        // navigateTo(window.location.pathname)
        verifyLocationHref()
    });
});

export function navigateTo(url) {
    // Update the URL and push a state to the browser's history
    history.pushState(null, null, url);
    ROUTER.currentRoute = window.location.pathname
    updateComponents()
}

export function verifyLocationHref() {
    let href  = window.location.href
    let host  = window.location.host
    let paginationRegex = new RegExp('^http:\/\/'+host+'\/page=[0-9]+$')
    let postRegex = new RegExp('^http:\/\/'+host+'\/post=[0-9]+$')

    if(USER_CONTROLLER.IsAuth){
        if (paginationRegex.test(href)) {
            PAGINATION_CONTROLLER.setCurrentPage(parseInt(href.match(/[0-9]+$/)))
            COMMENT_CONTROLLER.isPostSection = false
            updateSingleComponent('c-posts-container')
        }else if (postRegex.test(href)) {
            COMMENT_CONTROLLER.isPostSection = true
            let id = parseInt(href.match(/[0-9]+$/))
            document.dispatchEvent(new CustomEvent('postDetails', {detail: {data: id}}))
        }else {
            history.pushState(null, null, '/page=1')
            // navigateTo('/page=1')
            verifyLocationHref()
        }
    }else{
        
    }
    updateComponents()
}