package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func SignOut(res http.ResponseWriter, req *http.Request) {
	// Create a new cookie with the same name and set its expiration time to the past
	clearCookie := http.Cookie{
		Name:    "sessionid",
		Value:   "",
		Expires: time.Now().Add(-time.Hour), // Set expiration time to the past
		Path:    "/",
	}
	// Add the new cookie to the response
	http.SetCookie(res, &clearCookie)

	response := map[string]any{"message": "Logout successful"}
	if err := json.NewEncoder(res).Encode(response); err != nil {
		log.Println("Error encoding JSON response:", err)
	}

}
