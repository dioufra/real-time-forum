package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
	"strings"
	"time"
)

func Message(res http.ResponseWriter, req *http.Request) {

	if req.Method == http.MethodPost {
		var message models.Message

		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&message); err != nil {
			log.Println(err)
			http.Error(res, "Invalid request payload", http.StatusBadRequest)
			return
		}

		message.Date = time.Now()

		// log.Println("New message: ", message)

		message.Content = strings.Trim(message.Content, " ")
		if message.Content == "" {
			res.WriteHeader(http.StatusBadRequest)
			if err := json.NewEncoder(res).Encode(map[string]any{"message": "Message connot be empty"}); err != nil {
				log.Println("Error encoding JSON response:", err)
			}
			return
		}
		if err := models.MessageRepo.Add(&message); err != nil {
			log.Println("Error inserting message to database: ", err)
		}

		if err := json.NewEncoder(res).Encode(map[string]any{"message": "Message sent"}); err != nil {
			log.Println("Error encoding JSON response:", err)
		}

		_, receiver, err := helper.GetChatParticipants(message.SenderId, message.ReceiverId)
		if err != nil {
			helper.HandleError(res, "Error starting chat", http.StatusInternalServerError)
			return
		}

		email := receiver.Email
		client := models.GetConnectionByEmail(email, &clientsMutex, SocketClients); 
		if client == nil {
			log.Println("No client associated to sender email")
			return
		}

		// send the message to the receiver only
		// BroadcastContactedUsers()
		// BroadcastOnlineUsers()
		models.BroadCastContactedUser(client, email)
		
		BroadcastChat(message.SenderId, message.ReceiverId, message.ChatId, message.SenderAdress, message.ReceiverAdress)
		if err := Notify(message.ReceiverAdress, message.SenderId, message); err != nil {
			log.Println("Error notifying user: ", err)
		}
	}
	defer req.Body.Close()
}

func Notify(receiverAdress string, senderId int, message models.Message) error {
	var user models.User
	if err := models.UserRepo.GetUserById(&user, senderId); err != nil {
		return err
	}
	for client, tab := range SocketClients {
		if receiverAdress == tab[1] {
			data := &struct {
				Message models.Message
				Author  string
			}{
				Message: message,
				Author:  fmt.Sprintf("%s %s", user.Firstname, user.Lastname),
			}
			response := map[string]interface{}{"event": "Notify", "data": data}
			err := client.WriteJSON(response)
			if err != nil {
				log.Println(err)
			}
		}
	}
	return nil
}
