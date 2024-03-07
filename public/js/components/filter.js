import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { PAGE_CONTROLLER } from "../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo } from "../routes/routechecker.js"
import { ROUTER } from "../routes/routes.js"
import { updateSingleComponent } from "../script.js"

export default class Filter extends HTMLElement {
    constructor() {
        super()
        this.checkOnClickListener()
    }


    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkOnClickListener(){
        this.addEventListener('click',e => {
            if (e.target.tagName === 'A') {
                e.preventDefault()
                let id
                let href = e.target.href
                let regex = new RegExp(window.location.host +'\\/page=[1-9]\\d*\\?categorie=[(\\d)(default)]+$')
                if (regex.test(href)) {
                    id = parseInt(href.match(/[(\d)(default)]+$/)) || 0
                    PAGE_CONTROLLER.setCurrentPage(1)
                    CATEGORY_CONTROLLER.setCurrentCategoryId(id)
                        if (id) {
                            // navigateTo('/page=1?categorie='+id)
                            history.pushState(null, null, `/page=1?categorie=${id}`);
                            ROUTER.currentRoute = window.location.pathname
                            updateSingleComponent('c-posts-container')
                            updateSingleComponent('c-pagination')
                            updateSingleComponent('c-filter')
                        }else {
                            // navigateTo('/page=1')
                            history.pushState(null, null, `/page=1`);
                            ROUTER.currentRoute = window.location.pathname
                            updateSingleComponent('c-posts-container')
                            updateSingleComponent('c-pagination')
                            updateSingleComponent('c-filter')
                        }
                }

                // if (regex.test(href)) {
                //     id = parseInt(href.match(/[(\d)(default)]+$/)) || 0
                //     PAGE_CONTROLLER.setCurrentPage(1)
                //     CATEGORY_CONTROLLER.setCurrentCategoryId(id)
                //     history.pushState(null, null, `/page=${this.page}?categorie=${id}`);
                //     ROUTER.currentRoute = window.location.pathname
                //     updateSingleComponent('c-posts-container')
                //     updateSingleComponent('c-pagination')
                //     updateSingleComponent('c-filter')

                    
                // }
                // // CATEGORY_CONTROLLER.setCurrentCategoryId()
                // // const event = new CustomEvent('ok-category', {
                // //     detail: {
                // //         categoryId: id,
                // //         bubbles: true,
                // //         cancalable: true,
                // //         composed: true
                // //     }
                // // })
                // // this.dispatchEvent(event)
            }

        })
    }


    render() {
        this.innerHTML = /* HTML */ `
        <div class="filter">
            <div class="sec-center"> 	
                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                <label class="for-dropdown" for="dropdown">
                    ${CATEGORY_CONTROLLER.categories.find(c=>c.Id === CATEGORY_CONTROLLER.currentCategoryId)?.Name||'Categories'}
                </label>
                <div class="section-dropdown">
                  <a href="?categorie=default">All</a>
                    ${
                        CATEGORY_CONTROLLER.categories.map((category)=> (
                            category.Id === CATEGORY_CONTROLLER.currentCategoryId?`
                                <a style="background-color: #002EA3; border-radius: 2px;" href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>
                            `:`
                                <a href="?categorie=${category.Id}">${category.Name}</a>
                            `
                        )).join('')
                    }
                </div>
            </div>
        </div>
        `
    }
}