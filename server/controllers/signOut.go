package controllers

import (
	"fmt"
	"net/http"
	"real-time-forum/server/models"
)

func SignOut(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from logout")
	sess, err := req.Cookie("sessionid")
	if err != nil {
		fmt.Println("Error getting cookie", err)
		return
	}
	err = models.SessionRepo.DeleteSession(sess.Value)
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
