package router

import (
	"net/http"
	"real-time-forum/server/controllers"
	middlewares "real-time-forum/server/middleware"
)

func Route() {
	// http.HandleFunc("/sign_in", controllers.SignIn)

	http.HandleFunc("/api/login", middlewares.Ispath(middlewares.IsAuth(controllers.SignIn), "/api/login"))
	http.HandleFunc("/api/register", middlewares.Ispath(middlewares.IsAuth(controllers.SignUp), "/api/register"))
	http.HandleFunc("/api/logout", middlewares.Ispath(middlewares.Log(controllers.SignOut), "/api/logout"))
	http.HandleFunc("/api/getResponse", middlewares.Ispath(middlewares.Log(controllers.Response), "/api/getResponse"))


	// http.HandleFunc("/post", middlewares.Ispath(middlewares.Log(controllers.CreatePost), "/post"))
	http.HandleFunc("api/post/", controllers.GetPost)
	// http.HandleFunc("/appreciation", middlewares.Ispath(middlewares.Log(controllers.Appreciation), "/appreciation"))
	// http.HandleFunc("/comment_like", middlewares.Ispath(middlewares.Log(controllers.AppreciationComment), "/comment_like"))
	// http.HandleFunc("/filter-category", middlewares.Ispath(controllers.CatFilter, "/filter-category"))
	// http.HandleFunc("/liked", middlewares.Ispath(middlewares.Log(controllers.LikedPosts), "/liked"))
	// http.HandleFunc("/created", middlewares.Ispath(middlewares.Log(controllers.CreatedPosts), "/created"))
	// http.HandleFunc("/comment-register", middlewares.Ispath(middlewares.Log(controllers.CommentRegister), "/comment-register"))
	http.HandleFunc("/", controllers.Home)
}
