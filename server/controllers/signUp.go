package controllers

import (
	"fmt"
	"net/http"
	"real-time-forum/server/models"
)

// the path will be validated using middlewares.

func SignUp(res http.ResponseWriter, req *http.Request) {
	userData := models.UserData{}
	fmt.Println(userData)

	if req.Method == "POST" {
		fmt.Println("detected")
		// res.Write([]byte("hello la mifa"))
		res.Write([]byte("hello la mifa"))
	}
	// Retrieve user data using decode or unmarshall
}
