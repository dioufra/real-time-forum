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
var SocketClients = make(map[*websocket.Conn][]string) // Connected clients
var clientsMutex sync.Mutex                            // Mutex to synchronize access to the clients map

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

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	clientsMutex.Lock()
	// Get the memory address of the variable
	address := fmt.Sprintf("%p", &conn)
	// Add the new client to the clients map
	SocketClients[conn] = []string{email, address}

	clientsMutex.Unlock()
	BroadcastUserInfos(conn, email)
	BroadcastOnlineUsers()
	BroadcastAllUsers()
	BroadcastAllPosts()
	BroadcastAllCategories()

	defer func() {
		// Remove the client when the connection is closed
		clientsMutex.Lock()
		delete(SocketClients, conn)
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
			var post models.PostInfo
			err = models.PostRepo.GetPostById(&post, data.Data["postId"])
			if err != nil {
				log.Println("Error retrieving post ")
			}
			// sendback the comments here
			response := struct {
				Post     models.PostInfo
				Comments []models.CommentInfo
			}{
				Post:     post,
				Comments: comments,
			}
			BroadcastPostDetails(conn, response)
		}

	}
}

func BroadcastPostDetails(client *websocket.Conn, data any) {

	clientsMutex.Lock()
	defer clientsMutex.Unlock()
	response := map[string]interface{}{"event": "broadcastPostDetails", "data": data}
	err := client.WriteJSON(response)
	if err != nil {
		log.Println(err)
	}
}

func BroadcastUserInfos(client *websocket.Conn, email string) {
	user, err := GetUserByField(DB, "email", email)
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
	var users []models.User

	for _, tab := range SocketClients {
		email := tab[0]
		user, err := GetUserByField(DB, "email", email)
		if err != nil {
			fmt.Println("user not found")
			return
		}
		users = append(users, user)
	}
	for client, tab := range SocketClients { //send data
		data, email := []models.User{}, tab[0]
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

	users, err := models.UserRepo.GetAll()
	if err != nil {
		fmt.Println("Error getting users")
		return
	}
	for client, tab := range SocketClients { //send data
		data, email := []models.User{}, tab[0]
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
	for client := range SocketClients { //send data
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
	for client, _ := range SocketClients { //send data
		response := map[string]interface{}{"event": "broadcastAllCategories", "data": categories}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
func BroadcastChat(senderId, receiverId int, senderAdress, receverAdress string) {
	data := []models.Message{}
	for _, msg := range MESSAGES_TAB {
		if msg.ReceiverId == receiverId && msg.SenderId == senderId || msg.ReceiverId == senderId && msg.SenderId == receiverId {
			data = append(data, msg)
		}
	}
	for client, tab := range SocketClients {
		adress := tab[1]
		if adress == senderAdress || adress == receverAdress {
			response := map[string]interface{}{"event": "broadcastChat", "data": data}
			err := client.WriteJSON(response)
			if err != nil {
				log.Println(err)
			}
		}
	}
}
