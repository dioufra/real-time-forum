package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func Chat(res http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodPost {
		var body models.Message
		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&body); err != nil {
			fmt.Println("❌ Invalid request payload", err)
			helper.HandleError(res, "Invalid request payload", http.StatusBadRequest)
			return
		}
		// sender, err := GetUserByField(DB, "id", strconv.Itoa(body.SenderId))
		// if err != nil {
		// 	fmt.Println("Sender not found")
		// 	helper.HandleError(res, "Error starting chat", http.StatusInternalServerError)
		// 	return
		// }
		// receiver, err := GetUserByField(DB, "id", strconv.Itoa(body.ReceiverId))
		// if err != nil {
		// 	fmt.Println("Reciever not found")
		// 	return
		// }
		sender, receiver, err := helper.GetChatParticipants(body.SenderId, body.ReceiverId)
		if err != nil {
			helper.HandleError(res, "Error starting chat", http.StatusInternalServerError)
			return
		}
		for _, tab := range SocketClients {
			email, adress := tab[0], tab[1]
			if email == sender.Email {
				body.SenderAdress = adress
			} else if email == receiver.Email {
				body.ReceiverAdress = adress
			}
		}
		if err := models.MessageRepo.UpdateUnReadMessages(receiver.Id, sender.Id); err != nil {
			fmt.Println("❌ Error updating unread messages: ", err)
			helper.HandleError(res, "Could not get chat messages", http.StatusInternalServerError)
			return
		}
		// fmt.Println(nb)
		if err := json.NewEncoder(res).Encode(map[string]any{
			"message":        "Chat started",
			"SenderAdress":   body.SenderAdress,
			"ReceiverAdress": body.ReceiverAdress,
		}); err != nil {
			log.Println("Error encoding JSON response:", err)
			return
		}
		BroadcastChat(body.SenderId, body.ReceiverId, body.ChatId, body.SenderAdress, body.ReceiverAdress)
		BroadcastContactedUsers()
		BroadcastOnlineUsers()
	}
	defer req.Body.Close()
}
