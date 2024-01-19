export default class Header extends HTMLElement {
    constructor() {
        super()
        this.isAuth = false
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        // this._style()
    }

    disconnectedCallback() {
        console.log('disconnected')
    }

    shouldComponentRender() {
        return !this.innerHTML
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
                        ${this.isAuth ? /*HTML */ `
                            <a href="/logout" class="logout">Logout</a>
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
    }

    
    _style() {
        const style = document.createElement('style')
        style.textContent = `
        ${this.tagName} .main-header{
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: space-between;
            padding: 20px;
        }
        ${this.tagName} .main-header>.menu-a{
            padding: 0;
            background-color: #002ea3;
            width: 150px;
            height: 37px;
            border-radius: 23px;
            justify-content: center;
            align-items: center;
            font-weight: 600;
        }
        ${this.tagName} .main-header .join {

        }

        `
        console.log(this.header)
        this.appendChild(style)
            
        }

        get header() {
            console.log(this.querySelector('.main-header'))
            this.querySelector('.main-header')
        }
    }