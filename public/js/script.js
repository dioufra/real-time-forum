let components = [
    {tagName:'c-header',src:"./components/layout/header.js"},
    {tagName:'c-main',src:"./components/layout/main.js"},
    {tagName:'c-login',src:"./components/login.js"},
    {tagName:'c-register',src:"./components/register.js"},
    {tagName:'sc-user-info',src:"./components/userInfo.js"},
    {tagName:'c-posts-container',src:"./components/postsContainer.js"},
    {tagName:'c-socket',src:"./components/layout/socket.js"},
    {tagName:'c-pagination',src:"./components/pagination.js"},
    {tagName:'c-footer',src:"./components/layout/footer.js"},
    // {tagName:'c-post',src:"./components/post.js"},
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