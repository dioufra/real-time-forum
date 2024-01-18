package router

import (
	"net/http"
	"real-time-forum/server/controllers"
	middlewares "real-time-forum/server/middleware"
)

func Route() {
	// http.HandleFunc("/sign_in", controllers.SignIn)

	http.HandleFunc("/sign_in", middlewares.Ispath(middlewares.IsAuth(controllers.SignIn), "/sign_in"))
	// http.HandleFunc("/sign_up", middlewares.Ispath(middlewares.IsAuth(controllers.SignUp), "/sign_up"))
	// http.HandleFunc("/sign_out", middlewares.Ispath(middlewares.Log(controllers.SignOut), "/sign_out"))

	// http.HandleFunc("/post", middlewares.Ispath(middlewares.Log(controllers.CreatePost), "/post"))
	// http.HandleFunc("/post/", controllers.GetPost)
	// http.HandleFunc("/appreciation", middlewares.Ispath(middlewares.Log(controllers.Appreciation), "/appreciation"))
	// http.HandleFunc("/comment_like", middlewares.Ispath(middlewares.Log(controllers.AppreciationComment), "/comment_like"))
	// http.HandleFunc("/filter-category", middlewares.Ispath(controllers.CatFilter, "/filter-category"))
	// http.HandleFunc("/liked", middlewares.Ispath(middlewares.Log(controllers.LikedPosts), "/liked"))
	// http.HandleFunc("/created", middlewares.Ispath(middlewares.Log(controllers.CreatedPosts), "/created"))
	// http.HandleFunc("/comment-register", middlewares.Ispath(middlewares.Log(controllers.CommentRegister), "/comment-register"))
	http.HandleFunc("/", middlewares.Ispath(controllers.Home, "/"))
}
