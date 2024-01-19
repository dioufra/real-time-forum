let components = [
    {tagName:'c-header',src:"../js/components/layout/header.js"},
    {tagName:'c-main',src:"../js/components/layout/main.js"},
    {tagName:'c-login',src:"../js/components/login.js"},
    {tagName:'c-register',src:"../js/components/register.js"},
]
components.forEach(component => {
    import(component.src).then(module => {
        if (!customElements.get(component.tagName)) customElements.define(component.tagName, module.default)
    })
})

export const updateComponents = ()=> {
    components.forEach(component => {
        let myElement = document.querySelector(component.tagName);
        if (myElement?.render) {
            myElement.render()
        }
    })
}