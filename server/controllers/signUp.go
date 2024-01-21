package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/server/config"
	"real-time-forum/server/models"
	"regexp"
)

// the path will be validated using middlewares.

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
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

		// Verifiction de inputs
		fieldsTab := [][]string{
			{"firstname", "^[A-Za-z]+$", newUser.Firstname},
			{"lastname", "^[A-Za-z]+$", newUser.Lastname},
			{"age", "^[0-9]{1,2}$", newUser.Age},
			{"gender", "^(Male|Female)$", newUser.Gender},
			{"username", "^[a-z][a-z0-9]+$", newUser.Username},
			{"email", `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`, newUser.Email},
			{"password", "^(.){4}$", newUser.Password},
		}
		for _, item := range fieldsTab {
			field, pattern, str := item[0], item[1], item[2]
			// Compile the regular expression
			re, err := regexp.Compile(pattern)
			if err != nil {
				fmt.Println("Error compiling regex:", err)
				return
			}
			// Test if a string matches the regular expression
			if !re.MatchString(str) {
				// Create an error message.
				errorMessage := map[string]string{"message": "invalid " + field, "property": field}

				w.WriteHeader(http.StatusBadRequest)
				// Encode the error message as JSON and send it in the response.
				err := json.NewEncoder(w).Encode(errorMessage)
				if err != nil {
					// Handle the error, e.g., log it or send a generic error message.
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}
				return
			}
		}

		// Insert the new user into the database
		db, err := config.GetDB()
		if err != nil {
			fmt.Println(err)
		}
		insertQuery := "INSERT INTO users (firstname,lastname,age,gender,username,email, password) VALUES (?, ?, ?, ?, ?, ?, ?)"
		result, err := db.Exec(insertQuery, newUser.Firstname, newUser.Lastname, newUser.Age, newUser.Gender, newUser.Username, newUser.Email, newUser.Password)
		if err != nil {
			fmt.Println("Internal server error", http.StatusInternalServerError)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		// Get the ID of the newly inserted user
		userID, _ := result.LastInsertId()
		newUser.Id = int(userID)
		userData.User = newUser
		json.NewEncoder(w).Encode(userData)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}
