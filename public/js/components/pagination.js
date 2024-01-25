import { PAGINATION_CONTROLLER } from "../controllers/pagiantion.js"

export default class Pagination extends HTMLElement {
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
            ${((result="")=>{
                for (let i = PAGINATION_CONTROLLER.Iterate; i < PAGINATION_CONTROLLER.LastPage; i++)
                    result += `<a href="?page={{$id}}" class="page ${i===PAGINATION_CONTROLLER.CurrentPage && 'active'}">${i}</a>`
                return result
            })()}
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}