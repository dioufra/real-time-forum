package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/models"
	"regexp"
	"strings"
)

func AddPost(res http.ResponseWriter, req *http.Request) {
	// fmt.Println("Hello from post creation")
	if req.Method != http.MethodPost {
		fmt.Println("method not allowed")
	}

	var post models.PostPlayload
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&post); err != nil {
		fmt.Println("Invalid post playload: ", err)
		return
	}

	// Verifiction de inputs
	fieldsTab := [][]string{
		{"title", "^.+$", post.Title, "The title is required"},
		{"content", "^.+$", post.Content, "The content is required"},
		{"categories", "^\\[(10|[1-9])(,(10|[1-9]))*\\]$", strings.Join(strings.Fields(fmt.Sprint(post.Categories)), ","), "Choose at least 1 category"},
	}
	for _, item := range fieldsTab {
		field, pattern, str := item[0], item[1], item[2]
		// Compile the regular expression
		re, err := regexp.Compile(pattern)
		if err != nil {
			fmt.Println("Error compiling regex:", err)
			return
		}
		// Test if a string matches the regular expression
		if !re.MatchString(str) {
			// Create an error message.
			errorMessage := map[string]string{"message": "invalid " + field, "property": field}

			res.WriteHeader(http.StatusBadRequest)
			// Encode the error message as JSON and send it in the response.
			err := json.NewEncoder(res).Encode(errorMessage)
			if err != nil {
				// Handle the error, e.g., log it or send a generic error message.
				http.Error(res, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			return
		}
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
