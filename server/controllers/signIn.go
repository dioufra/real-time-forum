package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func SignIn(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var userLogin models.UserLogin

	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&userLogin); err != nil {
		log.Println("❌ Invalid request payload	", err)
		helper.HandleError(res, "Invalid request payload", http.StatusBadRequest)
		return
	}

	defer req.Body.Close()

	ok, user, err := helper.ValidateCredential(userLogin)
	if err != nil {
		log.Println("❌ Error retrieving the user")
		helper.HandleError(res, "Error retrieving the user", http.StatusInternalServerError)
		return
	}

	if !ok {
		log.Println(" Wrong credential")
		helper.HandleError(res, "wrong credential", http.StatusUnauthorized)
		return
	}

	sessionId := helper.SetCookie(res)

	if err := helper.SessionAddOrUpdate(DB, sessionId, user.Email); err != nil {
		log.Println("❌ Error updating session: ", err)
		helper.HandleError(res, "Could not add session	", http.StatusInternalServerError)
		return
	}
	helper.SendResponse(res, map[string]any{"message": "Login successful"}, http.StatusOK)
}
