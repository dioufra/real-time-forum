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
    {tagName:'c-chat-container',src:"./components/chatContainer.js"},
    {tagName:'c-chat',src:"./components/chat.js"},
    {tagName:'c-posts',src:"./components/posts.js"},
    {tagName:'c-comment',src:"./components/comment.js"},
    {tagName:'c-modal',src:"./components/newPost.js"},
    {tagName:'c-auth',src:"./components/auth.js"},
    {tagName:'c-filter',src:"./components/filter.js"},
    {tagName:'c-page-loader',src:"./components/pageLoader.js"},
    {tagName:'c-notification',src:"./components/notification.js"},
    {tagName:'c-error',src:"./components/error.js"},

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
export const updateSingleComponent = (tagName)=> {
    let elements = document.querySelectorAll(tagName);
    elements.forEach(element => {
        if (element?.render) element.render()
    })
}