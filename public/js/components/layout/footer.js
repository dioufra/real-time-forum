import { USER_CONTROLLER } from "../../controllers/user.js"
import { navigateTo } from "../../routes/routechecker.js"

export default class Footer extends HTMLElement {
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
            <div class="footer">
                <div class="logo">
                    <img src="/img/LOGO.png" alt="bg-image">
                </div>
                <div class="copyrigth">
                    <span class="footer-title">
                    justice league
                </span>   
                All rigth reserved .2023
                </div>
            </div>
        `
    }

    get header() {
        this.querySelector('.main-header')
    }
}