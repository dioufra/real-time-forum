import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { POST_CONTROLLER } from "../controllers/post.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        // this._style()
    }

    disconnectedCallback() {
        console.log('disconnected header')
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
        <div class="posts">
        ${
            POST_CONTROLLER.posts.map(post => (`
                <div class="post-teaser">
                    <div class="head">
                        <div class="ctn">
                            <div class="img">
                                <img src="//ui-avatars.com/api/?name=${post.User.UserName}&size=90&rounded=true&color=fff&background=random"
                                    alt="">
                            </div>
                            <div class="nm-tm">
                                <p>${post.User.UserName}</p>
                            </div>
                        </div>
                        <div class="feather">
                            ${post.Categories.map(catName => `
                                <span class="cm-time">  ${catName} </span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="text-area">
                        <a href="/post/${post.Id}" class="cmt-title">
                            ${post.Title}
                        </a>
                        <p class="cmt">
                            ${post.Content}
                        </p>
                    </div>
                    <div class="submenu">
                        <div class="sb-tags">
                        <div class="sb-tags-l like" onclick="Appreciation(${post.Id},1,0) ">
                            <div><img src="/static/img/icones/Heart.svg" alt=""></div>
                            <div id="like${post.Id}">${post.Nbrlike}</div>
                        </div>
                        <div class="sb-tags-l" onclick="Appreciation({{.OnePost.ID}},0,1) ">
                            <div id="dislike${post.Id}">${post.NbrDislike}</div>
                            <div>💔</div>
                        </div>
                        </div>
                        <div class="activity">
                        <a href="/post/${post.Id}" class="cmt-title">
                            <div><img src="/static/img/icones/message-square.svg" alt=""></div>
                            <div>${post.NbrComments}</div>
                        </a>
                        </div>
                    </div>
                </div>
            `)).join('')
        }
        </div>
        <c-pagination class="pagination"></c-pagination>
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}