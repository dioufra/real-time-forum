import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"

export default class Post extends HTMLElement {
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
        this.innerHTML = /* HTML */ ``
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}