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
	Event     string         `json:"event"`
	Type      string         `json:"type"`
	Component string         `json:"component"`
	Data      map[string]int `json:"data"`
}

func HandleDisconnection(connection *websocket.Conn, email string) {
	clientsMutex.Lock()
	delete(SocketClients, connection)
	clientsMutex.Unlock()
	connection.Close()

	// Broadcast the disconnection event to other clients
	BroadcastOnlineUsers()
	// BroadcastAllUsers(email)
	BroadcastAllUsers()
}

func registerClient(connection *websocket.Conn, email string) {
	clientsMutex.Lock()
	// Get the memory address of the variable
	address := fmt.Sprintf("%p", &connection)
	// Add the new client to the clients map
	SocketClients[connection] = []string{email, address}

	clientsMutex.Unlock()
	BroadcastUserInfos(connection, email)
	BroadcastOnlineUsers()
	BroadcastContactedUsers()
	BroadcastAllUsers()
	BroadcastAllPosts()
	BroadcastAllCategories()
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	is, email := helper.Auth(DB, r)
	if !is {
		fmt.Println("❌ unauthenticated user")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	registerClient(conn, email)

	defer func() {
		HandleDisconnection(conn, email)
	}()

	for {
		// Read the message from the client
		_, p, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// handleMessage(conn, p, email)

		var data IncomingMessage
		if err := json.Unmarshal(p, &data); err != nil {
			log.Println("Error unmarshalling message", err)
			continue
		}

		switch data.Event {

		case "postDetails":
			handlePostDetails(conn, data.Data["postId"])
		case "appreciation":
			handleAppreciation(conn, data)
		case "readMessages":
			handleReadMessage(data.Data["senderId"], data.Data["receiverId"])
		}
	}
}

func handleReadMessage(senderId, receiverId int) {
	clientsMutex.Lock()
	if senderId > 0 && receiverId > 0 {
		if err := models.MessageRepo.UpdateUnReadMessages(senderId, receiverId); err != nil {
			log.Println("Error updationg unread messages", err)
		}
	}
	clientsMutex.Unlock()
}

func handlePostDetails(conn *websocket.Conn, postId int) {
	comments, err := models.CommentRepo.GetCommentsFromPostId(postId)
	if err != nil {
		log.Println("Error retrieving comments", err)
		return
	}

	var post models.PostInfo
	if err := models.PostRepo.GetPostById(&post, postId); err != nil {
		log.Println("Error retrieving post ", err)
		return
	}

	response := struct {
		Post     models.PostInfo
		Comments []models.CommentInfo
	}{
		Post:     post,
		Comments: comments,
	}
	BroadcastPostDetails(conn, response)
}

func handleAppreciation(conn *websocket.Conn, data IncomingMessage) {
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
		if err != nil {
			fmt.Println("user not found")
			return
		}
		users = append(users, user)
	}
	for client, tab := range SocketClients { //send data
		data, email := []models.User{}, tab[0]
		recever, err := GetUserByField(DB, "email", email)
		if err != nil {
			fmt.Println("user not found")
			return
		}
		for _, user := range users {
			if user.Email != email {
				nb, err := models.MessageRepo.GetUnReadMessages(user.Id, recever.Id)
				if err != nil {
					fmt.Println("Error counting unread messages")
					return
				}
				user.UnReadMessages = nb
				data = append(data, user)
			}
		}
		response := map[string]interface{}{"event": "broadcastOnlineUsers", "data": data}
		err = client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}

func BroadcastContactedUsers() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for client, tab := range SocketClients { //send data
		email := tab[0]
		user, err := GetUserByField(DB, "email", email)
		if err != nil {
			fmt.Println("Error getting user by email field")
			return
		}
		users, err := models.UserRepo.GetContactedUsers(user.Id)
		if err != nil {
			fmt.Println("Error getting contacted users")
			return
		}
		response := map[string]interface{}{"event": "broadcastContactedUsers", "data": users}
		err = client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
func BroadcastAllUsers() {
	// Iterate through all connected clients and send the message
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	var user models.User
	for client, tab := range SocketClients {
		_, email := []models.User{}, tab[0]
		if err := models.UserRepo.GetUser(&user, email); err != nil {
			fmt.Println("Error getting user: ", err)
			return
		}
		users, err := models.UserRepo.GetUsersList(user.Id)
		if err != nil {
			fmt.Println("Error getting users", err)
			return
		}
		for _, _user := range users {
			nb, err := models.MessageRepo.GetUnReadMessages(_user.Id, user.Id)
			if err != nil {
				fmt.Println("Error counting unread messages")
				return
			}
			user.UnReadMessages = nb
		}
		response := map[string]interface{}{"event": "broadcastAllUsers", "data": users}
		err = client.WriteJSON(response)
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
			fmt.Println("Error")
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
	for client, _ := range SocketClients {
		response := map[string]interface{}{"event": "broadcastAllCategories", "data": categories}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
func BroadcastChat(senderId, receiverId, chatId int, senderAdress, receverAdress string) {
	messages, err := models.MessageRepo.Get(senderId, receiverId)
	if err != nil {
		fmt.Println("Error loading chat messages: ", err)
		return
	}

	for client := range SocketClients {
		data := &struct {
			Message []models.Message
			ChatId  int
		}{
			messages,
			chatId,
		}
		response := map[string]interface{}{"event": "broadcastChat", "data": data}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
