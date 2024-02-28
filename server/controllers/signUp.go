package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

// the path will be validated using middlewares.

func SignUp(w http.ResponseWriter, r *http.Request) {
	userData := models.UserData{}
	if r.Method != http.MethodPost {
		fmt.Println("Method not allowed!")
		return
	}

	var newUser models.User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&newUser); err != nil {
		fmt.Println(err)
		helper.HandleError(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if ok := helper.ValidateRegistrationInput(newUser, w); !ok {
		return
	}

	var userByEmail, userByName models.User
	if err := models.UserRepo.GetUser(&userByEmail, newUser.Email); err != nil {
		// send err user response here
		helper.HandleError(w, "Error registering user", http.StatusInternalServerError)
		return
	}
	if err := models.UserRepo.GetUser(&userByName, newUser.Username); err != nil {
		fmt.Println(err)
		// send err response here
		helper.HandleError(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	if ok := helper.IsUniqueLogin(userByEmail, userByName, w); !ok {
		return
	}

	// Hash password
	passWordHash, err := helper.HashPassword(newUser.Password)
	if err != nil {
		helper.HandleError(w, "Error registering user", http.StatusInternalServerError)
		return
	}
	newUser.Password = passWordHash

	result, err := models.UserRepo.Create(newUser)
	if err != nil {
		log.Println("🚨 Error registering user: ", err)
		http.Error(w, "Error registering use", http.StatusInternalServerError)
		return
	}
	log.Println("✅ Successfully added new user")

	// Get the ID of the newly inserted user
	userID, _ := result.LastInsertId()
	newUser.Id = int(userID)
	userData.User = newUser
	err = json.NewEncoder(w).Encode(userData)
	if err != nil {
		fmt.Println("err", err)
	}
}
