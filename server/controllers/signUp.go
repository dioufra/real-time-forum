package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"real-time-forum/server/config"
	"real-time-forum/server/models"
)

// the path will be validated using middlewares.

func SignUp(w http.ResponseWriter, r *http.Request) {
	userData := models.UserData{}
	if r.Method == http.MethodPost {
		var newUser models.User
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&newUser); err != nil {
			fmt.Println(err)
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()
		fmt.Println(newUser)

		// Insert the new user into the database
		db, err := config.GetDB()
		if err != nil {
			fmt.Println("connection database Error", err)
			os.Exit(0)
		}
		insertQuery := "INSERT INTO users (username, password) VALUES (?, ?)"
		result, err := db.Exec(insertQuery, newUser.Username, newUser.Password)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Get the ID of the newly inserted user
		userID, _ := result.LastInsertId()

		newUser.Id = int(userID)
		userData.User = newUser
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(userData)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
