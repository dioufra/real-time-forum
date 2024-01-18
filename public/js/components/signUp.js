export default class RegisterForm extends HTMLElement {
    constructor() {
        super()
        this.formSubmitListener = (event) => {
            console.log('form submitted')
        }

    }

    connectedCallback() {
        // add a form submission event listenner
        console.log('conntected')
        document.body.addEventListener('submit', this)
    }

    disconnetedCallback() {
        console.log('disconnected')
        document.body.removeEventListener('submit'. this.formSubmitListener)
    }
        
    render() {
        this.innerHTML = /* HTML */ `
            
        `
    }
}