import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo } from "../routes/routechecker.js"

export default class Filter extends HTMLElement {
    constructor() {
        super()
    }


    connectedCallback() {
        this.render()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        <div class="filter">
            <div class="sec-center"> 	
                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                <label class="for-dropdown" for="dropdown">Categories</label>
                <div class="section-dropdown">
                  <a href="/filter-categorie?categorie=default">All</a>
                    ${
                        CATEGORY_CONTROLLER.categories.map((category)=> (
                            category.Id === CATEGORY_CONTROLLER.currentCategoryId?`
                                <a style="background-color: #002EA3; border-radius: 2px;" href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>
                            `:`
                                <a href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>
                            `
                        )).join('')
                    }
                </div>
            </div>
        </div>
        `
    }
}