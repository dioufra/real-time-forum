import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { PAGE_CONTROLLER } from "../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"
import { updateSingleComponent } from "../script.js"
export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.commentPage = true
        this.Posts = []
        this.page = 1
        this.clickListener = (event) => {
            event.preventDefault()
            if (event.target.classList.contains('cmt-title')) {
                let id = parseInt(event.target.href.split('/').reverse()[0])
                document.dispatchEvent(new CustomEvent('postDetails', { detail: { data: id } }))
            }
        }
        this.paginationListener = (event) => {
            let page = event.detail.page
            POST_CONTROLLER.filteredPosts = POST_CONTROLLER.allPosts.slice((page - 1) * PAGE_CONTROLLER.PageSize, page * PAGE_CONTROLLER.PageSize)
            PAGE_CONTROLLER.setCurrentPage(page)
            history.pushState(null, null, window.location.href.replace(new RegExp('page=\\d'),'page='+page));
            updateSingleComponent('c-posts-container')
        }
        this.categoryListener = (event) => {
            let id = event.detail.categoryId
            PAGE_CONTROLLER.setCurrentPage(1)
            CATEGORY_CONTROLLER.setCurrentCategoryId(id)
        }
    }
    connectedCallback() {
        this.render()
        this.checkScrollListener()
        if (this.postSection) {
            this.addEventListener('ok-category', this.categoryListener)
            this.postSection.addEventListener('click', this.clickListener)
            this.addEventListener('ok-pagination', this.paginationListener)
        }
    }
    disconnectedCallback() {
        this.removeEventListener('ok-pagination', this.paginationListener)
        this.removeEventListener('ok-category', this.categoryListener)
    }
    shouldComponentRender() {
        return !this.innerHTML
    }
    checkScrollListener() {
        this.scrollTop = SCROLL_CONTROLLER.elements.postsContainer?.scrollTop || 0
        this.addEventListener('scroll', e => {
            SCROLL_CONTROLLER.setScroll('postsContainer', e.target)
        })
    }
    render() {
        this.innerHTML = /* HTML */ `
        ${COMMENT_CONTROLLER.isPostSection
            ?
            `<c-comment></c-comment>`
            :
            `
            <c-filter class="filter"></c-filter>
            <c-pagination class="pagination"></c-pagination>
            <c-posts></c-posts>
            <c-pagination class="pagination"></c-pagination>
            `
            }
        `
        this.postSection = this.querySelector('.posts')
    }
    get header() {
        this.querySelector('.main-header')
    }
}