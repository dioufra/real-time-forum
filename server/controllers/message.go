package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/models"
	"strings"
)

// var MESSAGES_TAB []models.Message

func Message(res http.ResponseWriter, req *http.Request) {

	if req.Method == http.MethodPost {
		var message models.Message

		// message.ID = len(MESSAGES_TAB)
		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&message); err != nil {
			fmt.Println(err)
			http.Error(res, "Invalid request payload", http.StatusBadRequest)
			return
		}
		fmt.Println(message)
		message.Content = strings.Trim(message.Content, " ")
		if message.Content == "" {
			res.WriteHeader(http.StatusBadRequest)
			if err := json.NewEncoder(res).Encode(map[string]any{"message": "Message connot be empty"}); err != nil {
				log.Println("Error encoding JSON response:", err)
			}
			return
		}
		// MESSAGES_TAB = append(MESSAGES_TAB, message)

		// INsert message into the database here
		if err := models.MessageRepo.Add(&message); err != nil {
			fmt.Println("Error inserting message to database: ", err)
		}

		if err := json.NewEncoder(res).Encode(map[string]any{"message": "Message sent"}); err != nil {
			log.Println("Error encoding JSON response:", err)
		}
		BroadcastChat(message.SenderId, message.ReceiverId, message.SenderAdress, message.ReceiverAdress)
	}
	defer req.Body.Close()
}
