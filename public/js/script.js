let components = [
    {tagName:'c-header',src:"../js/components/layout/header.js"},
    {tagName:'c-main',src:"../js/components/layout/main.js"},
    {tagName:'c-login',src:"../js/components/login.js"},
    {tagName:'c-register',src:"../js/components/register.js"},
    {tagName:'c-form',src:"../js/components/form.js"},
]
// Define the custom web component
components.forEach(component => {
    import(component.src).then(module => {
        if (!customElements.get(component.tagName)) customElements.define(component.tagName, module.default)
    })
})
export const updateComponents = ()=> {
    components.forEach(component => {
        let elements = document.querySelectorAll(component.tagName);
        elements.forEach(element => {
            if (element?.render) element.render()
        })
    })
}