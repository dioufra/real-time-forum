package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func SignIn(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from sign in")
	if req.Method != http.MethodPost {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var userLogin models.UserLogin
	var user models.User
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&userLogin); err != nil {
		fmt.Println(err)
		http.Error(res, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := models.UserRepo.GetUser(&user, userLogin.Login); err != nil {
		fmt.Println("Error: ", err)
	}

	if !helper.IsPasswordsMatch(user.Password, userLogin.Password){
		fmt.Println("Wrong credentials")
		return
	}
	fmt.Println("Login successfull")

	// return data 

	// var users []models.User

	users, err := models.UserRepo.GetAll()
	if err != nil {
		fmt.Println("Error retrieving users", err)
		return
	}

	fmt.Println(users)

	defer req.Body.Close()
}
