import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { CHAT_CONTROLLER } from "../controllers/chat.js"
import { FORM_CONTROLLER } from "../controllers/form.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"

export default class NewPost extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        console.log("rendering post modal");
        this.render()
        this.checkCloseButtonListener()
        this.checkSubmitListener()
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
    checkSubmitListener(){
        this.addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(this.postForm)
            
            fetch('/api/posts/add', {
                method: 'POST',
                body: JSON.stringify({
                    
                }),
            }).then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json()
                        .then(error => {
                            console.log(error.message)
                            FORM_CONTROLLER.setError('message',error.message)
                        })
                        return
                    } else {
                        throw new Error('Erreur de réseau');
                    }
                }
                return response.json()
            })
            .then(data => {
                console.log("data",data)
                if (data) {
                    // console.log('data',data)
                }
            })
            .catch(console.error);
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
        ${POST_CONTROLLER.IsAuth && POST_CONTROLLER.displayBox? /*HTML*/`
            <div class="overlay" ></div>
            <div class="modal-form-container" >
                <div class="modal-form">
                    <form action="/post" method="post" class="form-modal">
                        <input type="hidden" name="user_id" value="{{.User.Id }}">
                        <div class="input-form-m">
                            <p>
                                <label for="title-form">Title</label>
                            </p>
                            <input type="text" name="title" placeholder="title" required id="title-form">
                        </div>
                        <div class="box" style="width:200px;">
                        <details>
                            <summary>Categories</summary>
                            <ul>
                                <li>
                                    ${CATEGORY_CONTROLLER.categories.forEach(category => { /*HTML*/
                                        `<label><input type="checkbox" name="cat" value="${category.Id}" />${category.Name}</label>`
                                    })}
                                </li>
                            </ul>
                        </details>
                        </div>
                        <div class="input-form-m">
                            <p>
                                <label for="content-form">Content</label>
                            </p>
                            <textarea required name="content" id="content-form" cols="30" rows="10"></textarea>
                        </div>
                        <button class="post-submit" type="submit">Post</button>
                    </form>
                </div>
            </div>
        ` : ``}
        `
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