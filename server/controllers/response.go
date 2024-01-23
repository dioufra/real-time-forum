package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func Response(res http.ResponseWriter, req *http.Request) {
	fmt.Println("hello form response")

	if req.Method != http.MethodGet {
		fmt.Println("Bad method")
		return
	}

	ok, email := helper.Auth(DB, req)
	if !ok {
		fmt.Println(email, "not connected")
		return
	}
	fmt.Println("email", email)

	var user models.User

	err := models.UserRepo.GetUserByEmail(&user, email)
	if err != nil {
		fmt.Println("Error retrieving user")
		return
	}

	if err := json.NewEncoder(res).Encode(map[string]any{"user": user}); err != nil {
		// If encoding fails, log the error (you might want to handle this differently)
		log.Println("Error encoding JSON response:", err)
	}
}
