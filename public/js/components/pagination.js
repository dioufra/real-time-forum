import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { PAGE_CONTROLLER } from "../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo, verifyLocationHref } from "../routes/routechecker.js"
export default class Pagination extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
        this.checkButtonClickListener()
        this.filterPosts(PAGE_CONTROLLER.CurrentPage)
    }
    disconnectedCallback() {
    }
    shouldComponentRender() {
        return !this.innerHTML
    }
    checkButtonClickListener(){
        // Handle navigation when a link is clicked
        this.addEventListener('click', function (event) {
            if (event.target.tagName === 'A' ) {
                event.preventDefault();
                let page = parseInt(event.target.href.split('=').reverse()[0])
                if (Boolean(page)) {
                    const e = new CustomEvent('ok-pagination', {
                        detail: {page: page},
                        bubbles: true,
                        cancalable: true,
                        composed: true
                    })
                    POST_CONTROLLER.setCurrentPostId(page)
                    this.dispatchEvent(e)
                }
            }
        });
    }
    filterPosts(page){
        POST_CONTROLLER.filterByCategory(CATEGORY_CONTROLLER.currentCategoryId)
        PAGE_CONTROLLER.setCurrentPage(page)
    }
    render() {
        this.innerHTML = /* HTML */ `
            ${((result="")=>{
                for (let i = 1; i <= Math.ceil(POST_CONTROLLER.posts.length / PAGE_CONTROLLER.PageSize) ; i++)
                    result += `<a href="page=${i}" class="page ${i===PAGE_CONTROLLER.CurrentPage && 'active'}">${i}</a>`
                return result
            })()}
        `
    }
    get header() {
        this.querySelector('.main-header')
    }
}