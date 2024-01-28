package controllers

import (
	"fmt"
	"net/http"
	"real-time-forum/server/helper"
)

func SignOut(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from logout")
	ok, ErrorPage := helper.CheckRequest(req, "/logout", "get")
	if !ok {
		helper.ErrorPage(res, ErrorPage)
		return
	}
	sess, err := req.Cookie("sessionid")

	if err != nil {
		fmt.Println("Error getting cookie", err)
		return
	}

	err = helper.DeleteSessio(DB, sess.Value)
	if err != nil {
		fmt.Println("Error Deleting session from database: ", err)
		return
	}
	http.SetCookie(res, &http.Cookie{
		Name:  sess.Name,
		Path:  sess.Path,
		Value: "",
	})
}
