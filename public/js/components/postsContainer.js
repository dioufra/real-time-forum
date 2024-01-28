import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { POST_CONTROLLER } from "../controllers/post.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.seePostListener = event => {
            fetch('/api/post/')
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                            .then(error => {
                                console.log(error)
                            })
                    } else {
                        throw new Error('Network error')
                    }
                }
            }).then(data => {
                console.log(data);
            })
        }
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        this.seePostBtns.forEach(btn => {
            this.addEventListener('click', this.seePostListener)
        })
        // this._style()
    }

    disconnectedCallback() {
        this.seePostBtns.forEach(btn => {
            this.removeEventListener('click', this.seePostListener)
        })
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
                  <a href="api/filter-categorie?categorie=default">All</a>
                    ${
                        CATEGORY_CONTROLLER.categories.map((category) => 
                              (`<a href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>`)
                        ).join('\n')
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
                                <img src="//ui-avatars.com/api/?name=${post.Username}&size=90&rounded=true&color=fff&background=random"
                                    alt="">
                            </div>
                            <div class="nm-tm">
                                <p>${post.Username}</p>
                            </div>
                        </div>
                        <div class="feather">
                            <span class="cm-time">  ${post.categories} </span>
                        </div>
                    </div>
                    <div class="text-area">
                        <a href="/api/post/${post.Id}" class="cmt-title">
                            ${post.Title}
                        </a>
                        <p class="cmt">
                            ${post.Content}
                        </p>
                    </div>
                    <div class="submenu">
                        <div class="sb-tags">
                        <div class="sb-tags-l like" onclick="Appreciation(${post.Id},1,0) ">
                            <div><img src="/public/img/icones/Heart.svg" alt="img"></div>
                            <div id="like${post.Id}">${post.NbrLike}</div>
                        </div>
                        <div class="sb-tags-l" onclick="Appreciation(${post.ID},0,1) ">
                            <div id="dislike${post.Id}">${post.NbrDislike}</div>
                            <div>💔</div>
                        </div>
                        </div>
                        <div class="activity">
                        <a href="api/post/${post.Id}" class="cmt-title">
                            <div><img src="/public/img/icones/message-square.svg" alt=""></div>
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

    get seePostBtns() {
        return [...this.querySelectorAll('.cmt-title')]
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}