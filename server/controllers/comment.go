package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"log"
	"net/http"
	"os"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
	"strings"
	"time"
)

func AddComment(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Println("❌ Method not allowed: ", req.Method)
		helper.HandleError(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var comment models.FetchComment
	var post models.PostInfo
	var user models.User

	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&comment); err != nil {
		// log.Println("❌ Invalid request payload: ", err)
		helper.LogError(err)
		helper.HandleError(res, "Invalid request payload", http.StatusBadRequest)
		return
	}
	fmt.Println(comment)
	defer req.Body.Close()

	if strings.TrimSpace(comment.Content) == "" {
		helper.LogError(errors.New("comments cannot add empty comments"))
		helper.HandleError(res, "Comments cannot add empty comments", http.StatusBadRequest)
		return
	}

	if err := models.UserRepo.GetUserById(&user, comment.UserId); err != nil {
		// log.Println("❌ Error retrieving user:", err)
		helper.LogError(err)
		helper.HandleError(res, "Error retrieving user", http.StatusInternalServerError)
		return
	}

	if err := models.PostRepo.GetPostById(&post, comment.PostId); err != nil {
		// log.Println("❌ Error retrieving post:", err)
		helper.LogError(err)
		helper.HandleError(res, "Error retrieving post", http.StatusInternalServerError)
		return
	}

	if user.Id <= 0 || post.Id <= 0 {
		// log.Println("❌ User or post not found")
		helper.LogError(errors.New("user or post not found"))
		helper.HandleError(res, "User or post not found", http.StatusNotFound)
		return
	}

	seconds := int64(comment.Date / 1000)
	nanos := int64((comment.Date % 1000) * 1e6)

	date := time.Unix(seconds, nanos)
	comment.Content = html.EscapeString(comment.Content)

	if err := models.CommentRepo.Create(comment.PostId, comment.UserId, comment.Content, date); err != nil {
		// log.Println("❌ Error adding new comment:", err)
		helper.LogError(err)
		errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)
		errorLog.Print("❌", err)
		helper.HandleError(res, "Error adding new comment", http.StatusInternalServerError)
		return
	}

	comments, err := models.CommentRepo.GetCommentsFromPostId(comment.PostId)
	if err != nil {
		// log.Println("❌ Error retrieving comments:", err)
		helper.LogError(err)
		helper.HandleError(res, "Error retrieving comments", http.StatusInternalServerError)
		return
	}

	response := struct {
		Post     models.PostInfo
		Comments []models.CommentInfo
	}{
		Post:     post,
		Comments: comments,
	}

	for conn, tab := range SocketClients {
		log.Println("Sending info to clients:", tab)
		BroadcastPostDetails(conn, response)
	}

	if err := json.NewEncoder(res).Encode(response); err != nil {
		// log.Println("❌ Error encoding JSON response:", err)
		helper.LogError(err)
		return
	}
}
