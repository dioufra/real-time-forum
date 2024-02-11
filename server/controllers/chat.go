package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/models"
	"strconv"
)

func Chat(res http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodPost {
		var body models.Message
		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&body); err != nil {
			fmt.Println(err)
			http.Error(res, "Invalid request payload", http.StatusBadRequest)
			return
		}
		fmt.Println(body)
		sender, err := GetUserByField(DB, "id", strconv.Itoa(body.SenderId))
		if err != nil {
			fmt.Println("Sender not found")
			return
		}
		receiver, err := GetUserByField(DB, "id", strconv.Itoa(body.ReceiverId))
		if err != nil {
			fmt.Println("Reciever not found")
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
		if err := json.NewEncoder(res).Encode(map[string]any{
			"message":        "Chat started",
			"SenderAdress":   body.SenderAdress,
			"ReceiverAdress": body.ReceiverAdress,
		}); err != nil {
			log.Println("Error encoding JSON response:", err)
		}
		BroadcastChat(body.SenderId, body.ReceiverId, body.SenderAdress, body.ReceiverAdress)
	}
	defer req.Body.Close()
}
