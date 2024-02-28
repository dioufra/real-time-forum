import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"
import { updateSingleComponent } from "../script.js"

export default class NewPost extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        this.checkCloseButtonListener()
        this.checkSubmitListener()
        this.checkOverlayclickListener()
        this.checkInputListener()
    }

    disconnectedCallback() {
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkCloseButtonListener(){
        this.addEventListener('click',e => {
            if (e.target.tagName === 'BUTTON' && e.target.className === 'close-btn') {
                this.modal?.classList.add('hidden')
                CHAT_CONTROLLER.displayBox = false
            }
        })
    }
    checkOverlayclickListener(){
        this.addEventListener('click',e => {
            if (e.target.classList.contains('overlay')) {
                POST_CONTROLLER.hideBox()
            }
        })
    }
    checkSubmitListener(){
        this.addEventListener('submit', (event) => {
            event.preventDefault()
            const data = new FormData(this.postForm)
            const categories = []
            data.forEach((value, key) => {
                if (key !== 'category') {
                    data[key] = value
                } else {
                    categories.push(parseInt(value) || 0)
                }
            })

            data['categories'] = categories
            data['userId'] = parseInt(USER_CONTROLLER.Id) || 0

            console.log(data);
                
            fetch('/api/posts/add', {
                method: 'POST',
                body: JSON.stringify(data, {
                    method: 'POST',
                }),
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                        .then(error => {
                            // console.log(error.message)
                            FORM_CONTROLLER.setError('post',error.message)
                            updateSingleComponent('c-modal')
                        })
                        return
                    } else {
                        throw new Error('Erreur de réseau');
                    }
                }
                return response.json()
            })
            .then(data => {
                // console.log("data",data)
                if (data) {
                    // console.log('data',data)
                    POST_CONTROLLER.hideBox()
                }
            })
            .catch(console.error);
        })
    }

    checkInputListener(){
        this.addEventListener('input',e => {
            FORM_CONTROLLER.setInput('post',e.target)
        })
    }

    render() {
        this.innerHTML = /*HTML*/`
            ${POST_CONTROLLER.displayBox && USER_CONTROLLER.IsAuth ? /*HTML*/`
                <div class="overlay"></div>
                <div class="modal-form-container">
                    <div class="modal-form">
                        <form action="/post" method="post" class="form-modal">
                            <p class="error-message">${FORM_CONTROLLER.errors.post || ''}</p>
                            <div class="input-form-m">
                                <p>
                                    <label for="title-form">Title</label>
                                </p>
                                <input type="text" name="title" placeholder="title"  id="title-form"
                                    value="${FORM_CONTROLLER.forms?.post?.title ||''}" >
                            </div>
                            <div class="box" style="width:200px;">
                                <details>
                                    <summary>Categories</summary>
                                    <ul>
                                        <li>
                                            ${CATEGORY_CONTROLLER.categories.map(category => {
                                                return `
                                                <label>
                                                    <input type="checkbox" name="category" value="${category.Id}" 
                                                    ${FORM_CONTROLLER.forms?.post?.category?.find(v=> v===(""+category.Id))?"checked":""} />
                                                    ${category.Name}
                                                </label>`;
                                            }).join('')}
                                        </li>
                                    </ul>
                                </details>
                            </div>
                            <div class="input-form-m">
                                <p>
                                    <label for="content-form">Content</label>
                                </p>
                                <textarea  name="content" id="content-form" placeholder="content" cols="30" rows="10">${FORM_CONTROLLER.forms?.post?.content ||''}</textarea>
                            </div>
                            <button class="post-submit" type="submit">Post</button>
                        </form>
                    </div>
                </div>
             ` : ''
            }
`;

    }

    get modal (){
        return this.querySelector('.modal-form')
    }
    get postForm() {
        return this.querySelector('form')
    }
    get header() {
        this.querySelector('.main-header')
    }
}