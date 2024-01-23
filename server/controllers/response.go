package controllers

import (
	"fmt"
	"net/http"
	"real-time-forum/server/config"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func Response(res http.ResponseWriter, req *http.Request) {
	fmt.Println("hello form response")

	if req.Method != http.MethodGet {
		fmt.Println("Bad method")
		return
	}
	db, err := config.GetDB()
	if err != nil {
		fmt.Println("connection database Error", err)
		return
	}

	fmt.Println("email")
	
	ok, email := helper.Auth(db, req)
	if !ok {
		fmt.Println(email, "not connected")
		return
	}

	var user models.User

	err = models.UserRepo.GetUserByEmail(&user, email)
	if err != nil {
		fmt.Println("Error retrieving user")
		return
	}

	fmt.Println(user)
}
