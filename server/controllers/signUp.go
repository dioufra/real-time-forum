package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/server/models"
)

// the path will be validated using middlewares.

func SignUp(res http.ResponseWriter, req *http.Request) {
	userData := models.UserData{}
	if req.Method == http.MethodPost {
		var newUser models.User
		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&newUser); err != nil {
			fmt.Println(err)
			http.Error(res, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer req.Body.Close()
		userData.User = newUser
		fmt.Println(newUser)

		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(userData)
	} else {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
