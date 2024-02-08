package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/models"
)

func AddPost(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from post creation")
	if req.Method != http.MethodPost {
		fmt.Println("method not allowed")
	}

	var post models.PostPlayload
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&post); err != nil {
		fmt.Println("Invalid post playload: ", err)
		return
	}

	if err := models.PostRepo.CreatePost(post.Title, post.Content, post.UserId, post.Categories); err != nil {
		fmt.Println("Error inserting a new Post: ", err)
		return
	}

	if err := json.NewEncoder(res).Encode(map[string]any{"message": "post successfully created"}); err != nil {
		log.Println("Error encoding JSON response:", err)
		return
	}

	BroadcastAllPosts()
}

func GetPost(res http.ResponseWriter, req *http.Request) {}

func GetAllPost(res http.ResponseWriter, req *http.Request) {}

// func ValidePost(res http.ResponseWriter, req *http.Request) {}
