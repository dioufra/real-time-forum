package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func 	AddPost(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Println("method not allowed")
		return
	}

	var post models.PostPlayload
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&post); err != nil {
		log.Println("Invalid post playload: ", err)
		return
	}
	if ok := helper.ValidatePostInput(&post, res); !ok {
		log.Println("Cannot add post validation failed")
		return
	}

	if err := models.PostRepo.CreatePost(post.Title, post.Content, post.UserId, post.Categories); err != nil {
		log.Println("Error inserting a new Post: ", err)
		return
	}

	if err := json.NewEncoder(res).Encode(map[string]any{"message": "post successfully created"}); err != nil {
		log.Println("Error encoding JSON response:", err)
		return
	}

	BroadcastAllPosts()
}
