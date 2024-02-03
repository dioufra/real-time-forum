package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/server/models"
	"time"
)

func AddComment(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from comment end")
	if req.Method != http.MethodPost {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	res.Header().Set("Content-Type", "application/json")

	var comment models.FetchComment
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&comment); err != nil {
		fmt.Println(err)
		http.Error(res, "Invalid request playload", http.StatusBadRequest)
		return
	}

	var user models.User
	if err := models.UserRepo.GetUserById(&user, comment.UserId); err != nil {
		fmt.Println("Error retrieving user")
		return
	}
	
	var post models.PostInfo
	if err := models.PostRepo.GetPostById(&post, comment.PostId); err != nil {
		fmt.Println("Error retrieving user")
		return
	}

	if user.Id <= 0 || post.Id <= 0 {
		fmt.Println("Comment not related to user or post")
		return
	}

	
	seconds := int64(comment.Date / 1000)
	nanos := int64((comment.Date % 1000) * 1e6)
	
	date := time.Unix(seconds, nanos)
	
	if err := models.CommentRepo.Create(comment.PostId, comment.UserId, comment.Content, date); err != nil {
		fmt.Println("Error adding new comment: ", err)
	}
}

func GetComment(res http.ResponseWriter, req *http.Request) {}
