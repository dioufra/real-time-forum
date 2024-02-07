import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo } from "../routes/routechecker.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.commentPage = true
        this.clickListener = (event) => {
            event.preventDefault()
            console.log('clicked');
            if (event.target.classList.contains('cmt-title'))
            {
                // navigateTo(event.target.href)
                let id = parseInt(event.target.href.split('/').reverse()[0])
                document.dispatchEvent(new CustomEvent('postDetails', {detail: {data: id}}))
                navigateTo('/post='+id)
            }
        }
    }


    connectedCallback() {
        this.render()
        this.addEventListener('click', this.clickListener)
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        <div class="posts">
            ${
                POST_CONTROLLER.filteredPosts.map(post => (`
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
                                ${post.Categories.split(' ').map(cat => `
                                    <span class="cm-time">${cat}</span>
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
                                <div><img src="/public/img/icones/Heart.svg" alt="img"></div>
                                <div id="like${post.Id}">${post.NbrLike}</div>
                            </div>
                            <div class="sb-tags-l" onclick="Appreciation(${post.ID},0,1) ">
                                <div id="dislike${post.Id}">${post.NbrDislike}</div>
                                <div>💔</div>
                            </div>
                            </div>
                            <div class="activity">
                            <a href="/post/${post.Id}" class="cmt-title">
                                <div><img src="/public/img/icones/message-square.svg" alt=""></div>
                                <div>${post.NbrComments}</div>
                            </a>
                            </div>
                        </div>
                    </div>
                `)).join('')
            }
        </div>
        `
        this.postSection = this.querySelector('.posts')
    }

    get header() {
        this.querySelector('.main-header')
    }

}