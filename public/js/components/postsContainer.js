import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { SCROLL_CONTROLLER } from "../controllers/scroll.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.commentPage = true
        this.clickListener = (event) => {
            event.preventDefault()
            if (event.target.classList.contains('cmt-title'))
            {
                // navigateTo(event.target.href)
                let id = parseInt(event.target.href.split('/').reverse()[0])
                document.dispatchEvent(new CustomEvent('postDetails', {detail: {data: id}}))
            } else {
                console.log(event.target);
            }
        }
    }


    connectedCallback() {
        this.render()
        this.checkScrollListener()
        if (this.postSection)
            this.postSection.addEventListener('click', this.clickListener)
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkScrollListener() {
        this.scrollTop = SCROLL_CONTROLLER.elements.postsContainer?.scrollTop || 0
        this.addEventListener('scroll',e => {
            SCROLL_CONTROLLER.setScroll('postsContainer',e.target)
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
        <c-filter class="filter"></c-filter>
        ${
            COMMENT_CONTROLLER.isPostSection
            ?
            `<c-comment></c-comment>`
            :
            `
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