export default class Chat extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        this.checkCloseButtonListener()
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
            }
        })
    }

    render() {
        this.innerHTML = /* HTML */ `
            <div class="chat-modal">
                <div class="chat-header" >
                    <div class="user-infos" >
                        <img class="profil-img" src="https://picsum.photos/200" alt="">
                        <span class="name_container">
                            <p class="name">Cheikh Ndiaye</p>
                            <span class="username">@cheikhndiaye9</span>
                        </span>
                    </div>
                    <button class="close-btn">X</button>
                </div>
                <div class="chat-body" >
                    <div class="container-left">
                        <div class="message-container left">
                            <p>Salut comment cava </p>
                        </div>
                    </div>
                    <div class="container-right">
                        <div class="message-container right">
                            <p>Salut cava bien</p>
                        </div>
                    </div>
                </div>
                <div class="chat-footer" >
                    <form action="/api/message" method="post">
                        <input name="message" placeholder="Message" />
                        <button type="submit"></button>
                    </form> 
                </div>
            </div>
        `
    }

    get modal (){
        return this.querySelector('.chat-modal')
    }
    get header() {
        this.querySelector('.main-header')
    }
}