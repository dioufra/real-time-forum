import { USER_CONTROLLER } from "../../controllers/user.js"
import { updateComponents } from "../../script.js"

export default class Header extends HTMLElement {
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
    checkLogoutClickListener(){
        this.logoutButton?.addEventListener('click', ()=>{
            USER_CONTROLLER.disconnect()
        });
    }
    render() {
        this.innerHTML = /* HTML */ `
            <header>
                <div class="main-header">
                    <div class="logo" >
                        <a href="/">     
                            <img src="../../../public/img/LOGO.png"  alt="bg-image">
                        </a>
                    </div>
                
                    <div class="links">
                        ${USER_CONTROLLER.IsAuth ? /*HTML */ `
                            <button class="logout">Logout</button>
                        `
                        :  /* HTML */`
                            <a href="/register" class="sbcr">Register</a>
                            <a href="/login" class="join">Join us</a>
                        `
                        }   
                    </div>
                </div>
            </header>
        `
        this.checkLogoutClickListener()
    }
    get logoutButton(){
        return this.querySelector('button')
    }
    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}