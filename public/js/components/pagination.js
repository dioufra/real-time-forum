import { PAGINATION_CONTROLLER } from "../controllers/pagiantion.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { navigateTo } from "../routes/routechecker.js"

export default class Pagination extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // console.log(this)
        this.render()
        this.checkButtonClickListener()
        this.filterPosts(PAGINATION_CONTROLLER.CurrentPage)
    }

    disconnectedCallback() {
        console.log('disconnected header')
    }

    shouldComponentRender() {
        return !this.innerHTML
    }
    checkButtonClickListener(){
        // Handle navigation when a link is clicked
        this.addEventListener('click', function (event) {
            if (event.target.tagName === 'A' ) {
                event.preventDefault();
                let page = parseInt(event.target.href.split('=').reverse()[0])
                if ( Boolean(page)) {
                    this.filterPosts(page)
                }
                navigateTo(event.target.href);
            }
        });
    }
    filterPosts(page){
        PAGINATION_CONTROLLER.CurrentPage = page
        POST_CONTROLLER.filteredPosts = POST_CONTROLLER.posts.filter((post,index)=> {
            return index>(page-1)*10 && index < (page*10)
        })
        console.log('filterdPosts',POST_CONTROLLER.filteredPosts)
    }
    render() {
        this.innerHTML = /* HTML */ `
            ${((result="")=>{
                let LastPage = (POST_CONTROLLER.posts.length+1)/10
                for (let i = Math.max(1,PAGINATION_CONTROLLER.CurrentPage-5); i < Math.min(5,LastPage); i++)
                    result += `<a href="?page=${i}" class="page ${i===PAGINATION_CONTROLLER.CurrentPage && 'active'}">${i}</a>`
                return result
            })()}
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}