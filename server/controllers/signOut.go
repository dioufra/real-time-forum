package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func SignOut(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		return
	}
	clearCookie := http.Cookie{
		Name:    "sessionid",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
		Path:    "/",
	}
	http.SetCookie(res, &clearCookie)

	response := map[string]any{"message": "Logout successful"}
	if err := json.NewEncoder(res).Encode(response); err != nil {
		log.Println("Error encoding JSON response:", err)
	}

}
