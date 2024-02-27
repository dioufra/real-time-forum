import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { COMMENT_CONTROLLER } from "../controllers/comment.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { navigateTo } from "../routes/routechecker.js"
import { updateSingleComponent } from "../script.js"

export default class Comment extends HTMLElement {
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
            fetch('/api/comments/add', {
                method: 'POST',
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                            .then(error => {
                                FORM_CONTROLLER.setError('register', error.message)
                                updateSingleComponent('c-main')
                            })
                        return
                    } else {
                        throw new Error('Network error');
                    }
                }
                console.log(response);
            })
        }

        this.commentAppreciationListerner = event => {
            if (event.target.type === 'submit') return
            event.preventDefault()
            if (event.target.classList.contains('apprec')) {
                const type = event.target.getAttribute('data-appreciation-type')

                switch (type) {
                    case 'post':
                        document.dispatchEvent(new CustomEvent('appreciation', {
                            detail: {
                                type: event.target.getAttribute('data-appreciation-type'),
                                component: 'c-comment',
                                data: {
                                    userId: USER_CONTROLLER.Id || 0,
                                    postId: COMMENT_CONTROLLER.post.Id || 0,
                                    like: parseInt(event.target.getAttribute('data-like')) || 0,
                                    dislike: parseInt(event.target.getAttribute('data-dislike')) || 0
                                }
                            }
                        }))
                        break;
                    case 'comment':
                        document.dispatchEvent(new CustomEvent('appreciation', {
                            detail: {
                                type: event.target.getAttribute('data-appreciation-type'),
                                component: 'c-comment',
                                data: {
                                    userId: USER_CONTROLLER.Id || 0,
                                    postId: COMMENT_CONTROLLER.post.Id || 0,
                                    commentId: parseInt(event.target.getAttribute('data-commentId')) || 0,
                                    like: parseInt(event.target.getAttribute('data-like')) || 0,
                                    dislike: parseInt(event.target.getAttribute('data-dislike')) || 0
                                }
                            }
                        })
                    )
                }
            }
        }
    }


    connectedCallback() {
        this.render()
        this.addEventListener('submit', this.commentListerner)
        this.addEventListener('click', this.commentAppreciationListerner)
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
                            <p>${COMMENT_CONTROLLER.post.Date} ago</p>
                        </div>
                    </div>
                    <div class="feather">
                        ${COMMENT_CONTROLLER.post?.Categories?.split(' ')?.map(category => `
                            <span class="cm-time">${category}</span>
                        `).join('') || ''
            } 
                    </div>
                </div>
                <div class="text-area">
                    <p class="cmt-title">
                        ${COMMENT_CONTROLLER.post.Title || ''}
                    </p>
                    <p class="cmt">${COMMENT_CONTROLLER.post.Content || ''}</p>
                </div>
                <div class="submenu">
                    <div class="sb-tags">
                        <div class="sb-tags-l like">
                            <div><img class="apprec" src="/public/img/icones/Heart.svg" alt="" data-like="1" data-dislike="0" data-appreciation-type="post" data-postId="${COMMENT_CONTROLLER.post.Id}"></div>
                            <div id="like-post-id${COMMENT_CONTROLLER.post.Id}">${COMMENT_CONTROLLER.post.NbrLike}</div>
                        </div>
                        <div class="sb-tags-l">
                            <div id="dislike-post-id${COMMENT_CONTROLLER.post.Id}">${COMMENT_CONTROLLER.post.NbrDislike}</div>
                            <div class="apprec" data-like="0" data-dislike="1" data-appreciation-type="post" data-postId="${COMMENT_CONTROLLER.post.Id}">💔</div>
                        </div>
                    </div>
                </div>
                <div class="cmts-ct">
                        ${COMMENT_CONTROLLER.comments.length > 0 ? COMMENT_CONTROLLER.comments.map(comment => ( /* HTML */`
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
                                        <div class="sb-tags-l like">
                                            <div><img class="apprec" src="/public/img/icones/Heart.svg"  data-commentId="${comment.Id}" data-like="1" data-dislike="0" data-appreciation-type="comment" data-postId="${COMMENT_CONTROLLER.post.Id}" alt=""></div>
                                            <div id="like-comment-id${comment.Id}">${comment.Like}</div>
                                        </div>
                                        <div class="sb-tags-l">
                                            <div id="dislike-comment-id${comment.Id}">${comment.Dislike}</div>
                                            <div class="apprec" data-commentId="${comment.Id}" data-like="0" data-dislike="1" data-appreciation-type="comment" data-postId="${COMMENT_CONTROLLER.post.Id}">💔</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        `)).join('') : ''
            }
                </div>
                <div class="new-comment">
                    <form id="comment-form">
                        <input type="hidden" name="post_id" value="${COMMENT_CONTROLLER.post.Id}">
                        <input class="nc-ct" type="text" name="comment" placeholder="write your comment here...">
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

    get appreciationBtn() {
        return this.querySelector('.sb-tags')
    }
}