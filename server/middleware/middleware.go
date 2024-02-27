package middlewares

import (
	"net/http"
	"real-time-forum/server/controllers"
	"real-time-forum/server/helper"
)

func Log(next http.HandlerFunc) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) {
		if is, _ := helper.Auth(controllers.DB, r); is {
			next.ServeHTTP(w, r)
		} else {
			// http.Redirect(w, r, "/api/login", 302)
			helper.HandleError(w, "please sign in first", http.StatusUnauthorized)
		}
	}
	return http.HandlerFunc(fn)
}

func IsAuth(next http.HandlerFunc) http.HandlerFunc {
	fnt := func(w http.ResponseWriter, r *http.Request) {
		if is, _ := helper.Auth(controllers.DB, r); is {
			http.Redirect(w, r, "/", 302)
		} else {
			next.ServeHTTP(w, r)
		}
	}
	return http.HandlerFunc(fnt)
}

func Ispath(next http.HandlerFunc, path string) http.HandlerFunc {
	fnt := func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == path {
			next.ServeHTTP(w, r)
		} else {
			helper.ErrorPage(w, 404)
		}
	}
	return http.HandlerFunc(fnt)
}
