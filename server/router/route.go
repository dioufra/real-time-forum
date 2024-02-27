package router

import (
	"net/http"
	"real-time-forum/server/controllers"
	middlewares "real-time-forum/server/middleware"
)

func Route() {
	// http.HandleFunc("/sign_in", controllers.SignIn)

	http.HandleFunc("/api/chat", middlewares.Ispath(middlewares.Log(controllers.Chat), "/api/chat"))
	http.HandleFunc("/api/message", middlewares.Ispath(middlewares.Log(controllers.Message), "/api/message"))
	http.HandleFunc("/api/ws", middlewares.Ispath(middlewares.Log(controllers.HandleWebSocket), "/api/ws"))
	http.HandleFunc("/api/login", middlewares.Ispath(middlewares.IsAuth(controllers.SignIn), "/api/login"))
	http.HandleFunc("/api/register", middlewares.Ispath(middlewares.IsAuth(controllers.SignUp), "/api/register"))
	http.HandleFunc("/api/sign_out", middlewares.Ispath(middlewares.Log(controllers.SignOut), "/api/sign_out"))
	// http.HandleFunc("/api/getResponse", middlewares.Ispath(middlewares.Log(controllers.Response), "/api/getResponse"))

	// http.HandleFunc("/post", middlewares.Ispath(middlewares.Log(controllers.CreatePost), "/post"))
	// http.HandleFunc("/post/", controllers.GetPost)
	// http.HandleFunc("/api/appreciation", controllers.Appreciation)
	// http.HandleFunc("/api/posts/add", controllers.AddPost)

	// http.HandleFunc("/api/appreciation", middlewares.Ispath(middlewares.Log(controllers.Appreciation), "/api/appreciation"))
	http.HandleFunc("/api/posts/add", middlewares.Ispath(middlewares.Log(controllers.AddPost), "/api/posts/add"))
	// http.HandleFunc("/liked", middlewares.Ispath(middlewares.Log(controllers.LikedPosts), "/liked"))
	// http.HandleFunc("/created", middlewares.Ispath(middlewares.Log(controllers.CreatedPosts), "/created"))
	// http.HandleFunc("/api/comments/add", controllers.AddComment)
	http.HandleFunc("/api/comments/add", middlewares.Ispath(middlewares.Log(controllers.AddComment), "/api/comments/add"))

	http.HandleFunc("/", controllers.Home)
}
