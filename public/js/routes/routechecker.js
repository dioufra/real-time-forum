import { CATEGORY_CONTROLLER } from "../controllers/categorie.js";
import { COMMENT_CONTROLLER } from "../controllers/comment.js";
import { PAGE_CONTROLLER } from "../controllers/pagiantion.js";
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
function backToHomePage() {
    history.pushState(null, null, '/page=1')
    verifyLocationHref()
}
export function verifyLocationHref() {
    let href  = window.location.href
    let host  = window.location.host
    let paginationRegex = new RegExp(host+'\/page=[1-9]\\d*$')
    let postRegex = new RegExp(host+'\/post=[0-9]+$')
    let categoryRegex = new RegExp(host +'\\/page=[1-9]\\d*\\?categorie=[1-9]\\d*$')

    if(USER_CONTROLLER.IsAuth){
        if (paginationRegex.test(href)) {
            let page = parseInt(href.match(/[0-9]+$/))
            if (
                POST_CONTROLLER.posts.length === 0
                ||
                page >= 1 && page <= Math.ceil(POST_CONTROLLER.posts.length / PAGE_CONTROLLER.PageSize)
            ) {
                if (page > Math.ceil(POST_CONTROLLER.allPosts.length / PAGE_CONTROLLER.PageSize) ) {
                    alert('dd')
                }
                CATEGORY_CONTROLLER.currentCategoryId = 0
                PAGE_CONTROLLER.setCurrentPage(parseInt(href.match(/[0-9]+$/)))
                COMMENT_CONTROLLER.isPostSection = false
                updateSingleComponent('c-posts-container')
            }else{
                backToHomePage()
            }
        }else if (postRegex.test(href)) {
            COMMENT_CONTROLLER.isPostSection = true
            let id = parseInt(href.match(/[0-9]+$/))
            if(Boolean(POST_CONTROLLER.allPosts.find(p => p.Id === id))){
                document.dispatchEvent(new CustomEvent('postDetails', {detail: {data: id}}))
                updateSingleComponent('c-posts-container')
            }else{
                backToHomePage()
            }
        }else if (categoryRegex.test(href)) {
            let id = parseInt(href.match(/[(\d)(default)]+$/))||0
            let page = parseInt(href.match(/[0-9]+\?/))
            setTimeout(() => {
                if (
                    !CATEGORY_CONTROLLER.categories.find(c=>c.Id === id)
                    ||
                    page > Math.ceil(POST_CONTROLLER.posts.length / PAGE_CONTROLLER.PageSize)
                ) {
                    backToHomePage()
                    return
                }
            }, 1000);
            CATEGORY_CONTROLLER.setCurrentCategoryId(id)

            PAGE_CONTROLLER.setCurrentPage(parseInt(href.match(/[0-9]+\?/)))
            COMMENT_CONTROLLER.isPostSection = false
            updateSingleComponent('c-posts-container')
        }else {
            backToHomePage()
        }
    }else{
        
    }
    updateComponents()
}