import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { navigateTo } from "../routes/routechecker.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.commentPage = true
        this.clickListener = (event) => {
            event.preventDefault()
            if (event.target.classList.contains('cmt-title')) {
                // navigateTo(event.target.href)
                let id = parseInt(event.target.href.split('/').reverse()[0])
                document.dispatchEvent(new CustomEvent('postDetails', {detail: {data: id}}))
                navigateTo('/post='+id)
            } else if (event.target.classList.contains('apprec')) {
                document.dispatchEvent(new CustomEvent('appreciation', {
                    detail: {
                        type: event.target.getAttribute('data-appreciation-type'),
                        component: 'c-post',
                        data: {
                            userId: USER_CONTROLLER.Id || 0,
                            postId: parseInt(event.target.getAttribute('data-postId'))|| 0,
                            like: parseInt(event.target.getAttribute('data-like')) || 0,
                            dislike: parseInt(event.target.getAttribute('data-dislike')) || 0,
                        }
                    }
                }))
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
                                    <img src="//ui-avatars.com/api/?name=${post.Username}&size=60&rounded=true&color=fff&background=random"
                                        alt="">
                                </div>
                                <div class="nm-tm">
                                <p>${post.Username}</p>
                                <p>${post.Date} ago</p>
                                </div>
                            </div>
                            <div class="feather">
                                ${post.Categories.split(',').map(cat => `
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
                            <div class="sb-tags-l like">
                                <div><img class="apprec" src="/public/img/icones/Heart.svg"  data-like="1" data-dislike="0" data-appreciation-type="post" data-postId="${post.Id}" alt=""></div>
                                <div id="like-post-id${post.Id}">${post.NbrLike}</div>
                            </div>
                            <div class="sb-tags-l">
                                <div id="dislike-comment-id${post.Id}">${post.NbrDislike}</div>
                                <div class="apprec" data-commentId="${post.Id}" data-like="0" data-dislike="1" data-appreciation-type="post" data-postId="${post.Id}">💔</div>
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