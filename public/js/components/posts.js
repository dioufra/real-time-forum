import { CATEGORY_CONTROLLER } from "../controllers/categorie.js"
import { POST_CONTROLLER } from "../controllers/post.js"
import { USER_CONTROLLER } from "../controllers/user.js"

export default class Posts extends HTMLElement {
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

    render() {
        this.innerHTML = /* HTML */ `
        <div class="filter">
            <div class="sec-center"> 	
                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                <label class="for-dropdown" for="dropdown">Categories</label>
                <div class="section-dropdown">
                  <a href="/filter-categorie?categorie=default">All</a>
                    ${
                        CATEGORY_CONTROLLER.categories.map((category)=> (
                            category.Id === CATEGORY_CONTROLLER.currentCategoryId?`
                                <a style="background-color: #002EA3; border-radius: 2px;" href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>
                            `:`
                                <a href="/filter-categorie?categorie=${category.Id}">${category.Name}</a>
                            `
                        )).join('')
                    }
                </div>
            </div>
        </div>
        <div class="posts">
        ${
            POST_CONTROLLER.posts.map(post => (`
                <div class="post-teaser">
                    <div class="head">
                        <div class="ctn">
                            <div class="img">
                                <img src="//ui-avatars.com/api/?name=${post.User.UserName}&size=90&rounded=true&color=fff&background=random"
                                    alt="">
                            </div>
                            <div class="nm-tm">
                                <p>${post.User.UserName}</p>
                            </div>
                        </div>
                        <div class="feather">
                            ${post.Categories.map(catName => `
                                <span class="cm-time">  ${catName} </span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="text-area">
                        <a href="/post/${post.Id}" class="cmt-title">
                            ${post.Title}
                        </a>
                        <p class="cmt">
                            ${post.Content}
                        </p>
                    </div>
                    <div class="submenu">
                        <div class="sb-tags">
                        <div class="sb-tags-l like" onclick="Appreciation({{.OnePost.ID}},1,0) ">
                            <div><img src="/static/img/icones/Heart.svg" alt=""></div>
                            <div id="like{{.OnePost.ID}}">{{.Nbrlike}}</div>
                        </div>
                        <div class="sb-tags-l" onclick="Appreciation({{.OnePost.ID}},0,1) ">
                            <div id="dislike{{.OnePost.ID}}">{{.NbrDislike}}</div>
                            <div>💔</div>
                        </div>
                        </div>
                        <div class="activity">
                        <a href="/post/{{.OnePost.ID}}" class="cmt-title">
                            <div><img src="/static/img/icones/message-square.svg" alt=""></div>
                            <div>{{.NbrComments}}</div>
                        </a>
                        </div>
                    </div>
                </div>
            `)).join('')
        }
            {{ range .Datas}}
            <div class="post-teaser">
                <div class="head">
                    <div class="ctn">
                        <div class="img">
                            <img src="//ui-avatars.com/api/?name={{.Poster.Username}}&size=90&rounded=true&color=fff&background=random"
                                alt="">
                        </div>
                        <div class="nm-tm">
                            <p>{{.Poster.Username}}</p>
<!--                              
                            <p class="cm-time">{{ .OnePost.Date.Format "01-02 15:04:05"}} ago</p> -->
                        </div>
                    </div>
                    <div class="feather">
                      {{$IdPost:=.OnePost.ID}}
                      {{ range $Cats }}
                        {{if eq $IdPost .PostId}}
                         <span class="cm-time">  {{ .Name }} </span>
                        {{end}}
                      {{end}}
                    </div>
                </div>
                <div class="text-area">
                    <a href="/post/{{.OnePost.ID}}" class="cmt-title">
                        {{ if gt (len .OnePost.Title) 50}}
                          {{slice .OnePost.Title 0 47}}...
                        {{else}}
                          {{ .OnePost.Title }}
                        {{end}}
                    </a>
                    <p class="cmt">
                        {{ if gt (len .OnePost.Content) 300}}
                          {{slice .OnePost.Content 0 297}}...
                        {{else}}
                          {{ .OnePost.Content }}
                        {{end}}
                    </p>
                </div>
                <div class="submenu">
                    <div class="sb-tags">
                      <div class="sb-tags-l like" onclick="Appreciation({{.OnePost.ID}},1,0) ">
                          <div><img src="/static/img/icones/Heart.svg" alt=""></div>
                          <div id="like{{.OnePost.ID}}">{{.Nbrlike}}</div>
                      </div>
                      <div class="sb-tags-l" onclick="Appreciation({{.OnePost.ID}},0,1) ">
                          <div id="dislike{{.OnePost.ID}}">{{.NbrDislike}}</div>
                          <div>💔</div>
                      </div>
                    </div>
                    <div class="activity">
                      <a href="/post/{{.OnePost.ID}}" class="cmt-title">
                        <div><img src="/static/img/icones/message-square.svg" alt=""></div>
                        <div>{{.NbrComments}}</div>
                      </a>
                    </div>
                </div>
            </div>
            {{end}}
        </div>
        <div class="pagination">
            {{$active := .Pagin.CurrentPage}}
            {{range $id := .Pagin.Iterate .Pagin.LastPage}}
              {{if eq $id $active}}
                <a href="?page={{$id}}" class="page active">{{$id}}</a>
              {{else}}
                <a href="?page={{$id}}" class="page">{{$id}}</a>
              {{end}}
            {{end}}
        </div>
        `
    }

    get header() {
        console.log(this.querySelector('.main-header'))
        this.querySelector('.main-header')
    }
}