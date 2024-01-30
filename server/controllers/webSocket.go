package controllers

import (
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
	clients[conn] = email
	clientsMutex.Unlock()
	BroadcastOnlineUsers()
	BroadcastAllUsers()
	BroadcastAllPosts()

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
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
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
