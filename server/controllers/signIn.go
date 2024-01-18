package controllers

import "net/http"

func SignIn(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("Welcome to the sign up page"))
}
