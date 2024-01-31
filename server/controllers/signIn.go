package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func SignIn(res http.ResponseWriter, req *http.Request) {
	fmt.Println("User Authentificated")
	res.Header().Set("Content-Type", "application/json")
	if req.Method != http.MethodPost {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var userLogin models.UserLogin
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&userLogin); err != nil {
		fmt.Println(err)
		http.Error(res, "Invalid request payload", http.StatusBadRequest)
		return
	}

	ok, user, err := helper.ValidateCredential(userLogin)
	if err != nil {
		fmt.Println("Error retrieving the user")
		return
	}

	// might consider creating a response function
	if !ok {
		fmt.Println("Wrong credential")
		res.WriteHeader(http.StatusBadRequest)
		if err := json.NewEncoder(res).Encode(map[string]any{"message": "wrong credential", "user": models.UserResponseData{}}); err != nil {
			log.Println("Error encoding JSON response:", err)
		}
		return
	}

	fmt.Println("login successfull")
	sessionId := helper.SetCookie(res)

	errSession := helper.SessionAddOrUpdate(DB, sessionId, user.Email)
	if errSession != nil {
		fmt.Println(errSession)
		return
	}

	if err := json.NewEncoder(res).Encode(map[string]any{"message": "Login successful"}); err != nil {
		log.Println("Error encoding JSON response:", err)
	}

	defer req.Body.Close()
}
