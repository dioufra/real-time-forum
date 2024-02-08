import { PAGINATION_CONTROLLER } from "../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo } from "../routes/routechecker.js"

export default class Pagination extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        this.checkButtonClickListener()
        this.filterPosts(PAGINATION_CONTROLLER.CurrentPage)
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
                if ( Boolean(page)) {
                    this.filterPosts(page)
                }
                navigateTo(event.target.href);
            }
        });
    }
    filterPosts(page){
        PAGINATION_CONTROLLER.setCurrentPage(page)
    }
    render() {
        this.innerHTML = /* HTML */ `
            ${((result="")=>{
                for (let i = 1; i <= Math.ceil(POST_CONTROLLER.posts.length / PAGINATION_CONTROLLER.PageSize) ; i++)
                    result += `<a href="page=${i}" class="page ${i===PAGINATION_CONTROLLER.CurrentPage && 'active'}">${i}</a>`
                return result
            })()}
        `
    }

    get header() {
        this.querySelector('.main-header')
    }
}