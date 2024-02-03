import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { navigateTo } from "../routes/routechecker.js"

export default class PostsContainer extends HTMLElement {
    constructor() {
        super()
        this.commentListerner = (event) => {
            event.preventDefault()
            const date = Date.now()
            const formData = new FormData(this.commentForm)
            const data = {}
            formData.forEach((value, key) => {
                if (key === 'post_id') value = parseInt(value)
                data[key] = value
            })
            data['Use_id'] = USER_CONTROLLER.Id
            data['date'] = date
            console.log(data);
            fetch('/api/comment', {
                method: 'POST',
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                        .then(error => {
                            FORM_CONTROLLER.setError('register',error.message)
                        })
                        return
                    } else {
                        throw new Error('Network error');
                    }
                }
                console.log(response);
            })
        }
    }


    connectedCallback() {
        this.render()
        this.addEventListener('submit', this.commentListerner)
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }

    render() {
        this.innerHTML = /* HTML */ `
        <div class="post-teaser">
                <div class="head">
                    <div class="ctn">
                        <div class="img">
                            <img src="//ui-avatars.com/api/?name=${COMMENT_CONTROLLER.post.Username}&size=90&rounded=true&color=fff&background=random"
                            alt="">
                        </div>
                        <div class="nm-tm">
                            <p>${COMMENT_CONTROLLER.post.Username}</p>
                            ${COMMENT_CONTROLLER.post.Date} ago</p>
                        </div>
                    </div>
                    <div class="feather">
                        ${COMMENT_CONTROLLER.post.Categories.split(' ').map(category => `
                            <span class="cm-time">${category}</span>
                        `).join('')
                        } 
                    </div>
                </div>
                <div class="text-area">
                    <p class="cmt-title">
                        <p href="#">
                            ${COMMENT_CONTROLLER.post.Title}
                        </p></p>
                    <p class="cmt">
                        ${COMMENT_CONTROLLER.post.Content}
                    </p>
                </div>
                <div class="submenu">
                    <div class="sb-tags">
                        <div class="sb-tags-l like" onclick="Appreciation(${COMMENT_CONTROLLER.post.Id},1,0) ">
                            <div><img src="/public/img/icones/Heart.svg" alt=""></div>
                            <div id="like${COMMENT_CONTROLLER.post.Id}">${COMMENT_CONTROLLER.post.NbrLike}</div>
                        </div>
                        <div class="sb-tags-l" onclick="Appreciation(${COMMENT_CONTROLLER.post.ID},0,1) ">
                            <div id="dislike${COMMENT_CONTROLLER.post.Id}">${COMMENT_CONTROLLER.post.NbrDislike}</div>
                            <div>💔</div>
                        </div>
                    </div>
                </div>
                <div class="cmts-ct">
                        ${COMMENT_CONTROLLER.comments.length > 0 ? COMMENT_CONTROLLER.comments.slice(0, 2).map(comment => (`
                            <div class="cmt-ct">
                                <div class="usr-cmt-photo"><img
                                        src="//ui-avatars.com/api/?name=${comment.Username}&size=90&rounded=true&color=fff&background=random"
                                        alt=""></div>
                                <div class="comment">
                                    <div class="cmt-head">
                                        <p>${comment.Username}</p>
                                    </div>
                                    <div class="cmt-text">
                                        <p class="cmt">
                                            ${comment.Content}
                                        </p>
                                    </div>
                                    <div class="sb-tags">
                                        <div class="sb-tags-l like" onclick="CommentAppre(${comment.Id},1,0) ">
                                            <div><img src="/public/img/icones/Heart.svg" alt=""></div>
                                            <div id="likecom${comment.Id}">${comment.Like}</div>
                                        </div>
                                        <div class="sb-tags-l" onclick="CommentAppre(${comment.Id},0,1) ">
                                            <div id="dislikecom${comment.Id}">${comment.Dislike}</div>
                                            <div>💔</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        `)).join('') : ''
                    }
                </div>
                <div class="new-comment">
                    <form id="comment-form"  action="/api/addComment" method="post">
                        <input type="hidden" name="post_id" value="${COMMENT_CONTROLLER.post.Id}">
                        <input class="nc-ct" type="text" name="comment" required min="3"
                            placeholder="write your comment here...">
                        <div class="nc-cm-btn-p">
                            </br>
                            <button class="submit-btn" type="submit">submit</button>
                        </div>
                    </form>
                </div>
        </div>
        `   
    }

    get commentForm() {
        return this.querySelector('form')
    }
}