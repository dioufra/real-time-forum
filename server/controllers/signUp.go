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
	
	// Retrieve user data using decode or unmarshall
}
