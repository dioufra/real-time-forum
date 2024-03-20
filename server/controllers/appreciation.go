package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func AddAppreciation(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Println("method not allowed")
	}
	var data IncomingMessage
	var user models.User
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&data); err != nil {
		log.Println("Invalid post playload: ", err)
		return
	}

	if err := models.UserRepo.GetUserById(&user, data.Data["userId"]); err != nil {
		// log.Println("❌ Error retrieving user:", err)
		helper.HandleError(res, "Error retrieving user", http.StatusInternalServerError)
		return
	}

	conn := models.GetConnectionByEmail(user.Email, &clientsMutex, SocketClients)

	switch data.Type {
	case "post":
		if data.Component == "c-comment" {
			if err := models.AppreciationRepo.AddForPost(data.Data["userId"], data.Data["postId"], data.Data["like"], data.Data["dislike"]); err != nil {
				log.Println("Error adding a new appreciation: ", err)
				return
			}
			handlePostDetails(conn, data.Data["postId"])
		} else {
			if err := models.AppreciationRepo.AddForPost(data.Data["userId"], data.Data["postId"], data.Data["like"], data.Data["dislike"]); err != nil {
				log.Println("Error adding a new appreciation: ", err)
				return
			}
			BroadcastAllPosts()
		}
	case "comment":
		if err := models.AppreciationRepo.AddForComment(data.Data["userId"], data.Data["commentId"], data.Data["like"], data.Data["dislike"]); err != nil {
			log.Println("Error adding a new appreciation: ", err)
			return
		}
		handlePostDetails(conn, data.Data["postId"])
	}
	helper.SendResponse(res, map[string]any{"message": "appreciation added"}, http.StatusOK)

}
