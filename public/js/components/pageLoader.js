import { PAGE_CONTROLLER } from "../controllers/pagiantion.js"

export default class PageLoader extends HTMLElement {
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
            <div class="loader"></div>
        `
    }
    get header() {
        this.querySelector('.main-header')
    }
}