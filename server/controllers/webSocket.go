package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
var clients = make(map[*websocket.Conn]string) // Connected clients
var clientsMutex sync.Mutex                    // Mutex to synchronize access to the clients map

type IncomingMessage struct {
	Type string         `json:"type"`
	Data map[string]int `json:"data"`
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	is, email := helper.Auth(DB, r)
	if !is {
		fmt.Println("not connected")
		return
	}
	fmt.Println("connected")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	// Add the new client to the clients map
	clientsMutex.Lock()
	fmt.Println(clients)
	clients[conn] = email
	fmt.Println(clients)

	clientsMutex.Unlock()
	BroadcastUserInfos(conn, email)
	BroadcastOnlineUsers()
	BroadcastAllUsers()
	BroadcastAllPosts()
	BroadcastAllCategories()

	defer func() {
		// Remove the client when the connection is closed
		clientsMutex.Lock()
		delete(clients, conn)
		clientsMutex.Unlock()
		conn.Close()

		// Broadcast the disconnection event to other clients
		BroadcastOnlineUsers()
		BroadcastAllUsers()
	}()

	for {
		// Read the message from the client
		_, p, err := conn.ReadMessage()
		if err != nil {
			break
		}
		fmt.Println(string(p))

		var data IncomingMessage
		if err := json.Unmarshal(p, &data); err != nil {
			log.Println("Error unmarshalling message", err)
			return
		}
		switch data.Type {
		case "postDetails":
			comments, err := models.CommentRepo.GetCommentsFromPostId(data.Data["postId"])
			if err != nil {
				log.Println("Error retrieving comments", err)
				return
			}
			fmt.Println(comments)
			post, err := models.PostRepo.GetPostById(data.Data["postId"])
			if err != nil {
				log.Println("Error retrieving post ")
			}
			// sendback the comments here
			response := struct {
				Post     models.PostInfo
				Comments []models.Comment
			}{
				Post:     post,
				Comments: comments,
			}
			fmt.Println("Succesfully retrieved post details: ", response)
			BroadcastPostDetails(conn, response)
		}

	}
}

func BroadcastPostDetails(client *websocket.Conn, data any) {

	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	// // Handle logic for fetching comments based on the data
	// fmt.Println("Received fetchComments event:", data)

	// for client, _ := range clients { //send data
	// 	response := map[string]interface{}{"event": "broadcastAllCategories", "data": data}
	// 	err := client.WriteJSON(response)
	// 	if err != nil {
	// 		log.Println(err)
	// 	}
	// }
	response := map[string]interface{}{"event": "broadcastPostDetails", "data": data}
	err := client.WriteJSON(response)
	if err != nil {
		log.Println(err)
	}
}

func BroadcastUserInfos(client *websocket.Conn, email string) {
	user, err := GetUserByEmail(DB, email)
	if err != nil {
		fmt.Println("user not found")
		return
	}

	response := map[string]interface{}{"event": "broadcastUserInfos", "data": user}
	err = client.WriteJSON(response)
	if err != nil {
		log.Println(err)
	}
}

func BroadcastOnlineUsers() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()
	users := []models.User{}

	for _, email := range clients {
		user, err := GetUserByEmail(DB, email)
		if err != nil {
			fmt.Println("user not found")
			return
		}
		users = append(users, user)
	}
	for client, email := range clients { //send data
		data := []models.User{}

		for _, user := range users {
			if user.Email != email {
				data = append(data, user)
			}
		}
		response := map[string]interface{}{"event": "broadcastOnlineUsers", "data": data}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}

func BroadcastAllUsers() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	userRep := models.UserRepository{DB: DB}
	users, err := userRep.GetAll()
	if err != nil {
		fmt.Println("Error getting users")
		return
	}
	for client, email := range clients { //send data
		data := []models.User{}
		for _, user := range users {
			if user.Email != email {
				data = append(data, user)
			}
		}
		response := map[string]interface{}{"event": "broadcastAllUsers", "data": data}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
func BroadcastAllPosts() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	posts, err := models.PostRepo.GetAllPost()
	if err != nil {
		fmt.Println("Error getting posts", err)
		return
	}
	for client, _ := range clients { //send data
		response := map[string]interface{}{"event": "broadcastAllPosts", "data": posts}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}

func BroadcastAllCategories() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	categories, err := models.CategoryRepo.GetCategories()
	if err != nil {
		fmt.Println("Error retrieving categories: ", err)
		return
	}
	for client, _ := range clients { //send data
		response := map[string]interface{}{"event": "broadcastAllCategories", "data": categories}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
