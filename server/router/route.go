package router

import (
	"net/http"
	"real-time-forum/server/controllers"
	middlewares "real-time-forum/server/middleware"
)

func Route() {
	http.HandleFunc("/api/chat", middlewares.Ispath(middlewares.Log(controllers.Chat), "/api/chat"))
	http.HandleFunc("/api/message", middlewares.Ispath(middlewares.Log(controllers.Message), "/api/message"))
	http.HandleFunc("/api/ws/", middlewares.Ispath(middlewares.Log(controllers.HandleWebSocket), "/api/ws/"))
	http.HandleFunc("/api/login", middlewares.Ispath(middlewares.IsAuth(controllers.SignIn), "/api/login"))
	http.HandleFunc("/api/register", middlewares.Ispath(middlewares.IsAuth(controllers.SignUp), "/api/register"))
	http.HandleFunc("/api/sign_out", middlewares.Ispath(middlewares.Log(controllers.SignOut), "/api/sign_out"))
	http.HandleFunc("/api/posts/add", middlewares.Ispath(middlewares.Log(controllers.AddPost), "/api/posts/add"))
	http.HandleFunc("/api/comments/add", middlewares.Ispath(middlewares.Log(controllers.AddComment), "/api/comments/add"))
	http.HandleFunc("/", controllers.Home)
}
