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
	// BroadcastAllUsers(email)
	BroadcastContactedUsers()
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
		// BroadcastAllUsers()
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
		switch data.Event {
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
		case "appreciation":
			switch data.Type {
			case "post":
				if data.Component == "c-comment" {
					if err := models.AppreciationRepo.AddForPost(data.Data["userId"], data.Data["postId"], data.Data["like"], data.Data["dislike"]); err != nil {
						fmt.Println("Error adding a new appreciation: ", err)
						return
					}
					comments, err := models.CommentRepo.GetCommentsFromPostId(data.Data["postId"])
					if err != nil {
						log.Println("Error retrieving comments", err)
						return
					}
					var post models.PostInfo
					if err := models.PostRepo.GetPostById(&post, data.Data["postId"]); err != nil {
						log.Println("Error retrieving post ")
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
				} else {
					if err := models.AppreciationRepo.AddForPost(data.Data["userId"], data.Data["postId"], data.Data["like"], data.Data["dislike"]); err != nil {
						fmt.Println("Error adding a new appreciation: ", err)
						return
					}
					fmt.Println("test")
					BroadcastAllPosts()
				}
			case "comment":
				if err := models.AppreciationRepo.AddForComment(data.Data["userId"], data.Data["commentId"], data.Data["like"], data.Data["dislike"]); err != nil {
					fmt.Println("Error adding a new appreciation: ", err)
				}

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

	users, err := models.UserRepo.GetAll()
	if err != nil {
		fmt.Println("Error getting users")
		return
	}
	for client, tab := range SocketClients { //send data
		data, email := []models.User{}, tab[0]
		receiver, err := GetUserByField(DB, "email", email)
		if err != nil {
			fmt.Println("Error getting user by email field")
			return
		}
		for _, user := range users {
			if user.Email != email {
				nb, err := models.MessageRepo.GetUnReadMessages(user.Id, receiver.Id)
				if err != nil {
					fmt.Println("Error counting unread messages")
					return
				}
				user.UnReadMessages = nb
				data = append(data, user)
			}
		}
		response := map[string]interface{}{"event": "broadcastAllUsers", "data": data}
		err = client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}

// func BroadcastAllUsers(email string) {
// 	// Iterate through all connected clients and send the message
// 	clientsMutex.Lock()
// 	defer clientsMutex.Unlock()

// 	users, err := models.UserRepo.GetAll()
// 	if err != nil {
// 		fmt.Println("Error getting users")
// 		return
// 	}
// 	for client, tab := range SocketClients { //send data
// 		data, email := []models.User{}, tab[0]
// 		for _, user := range users {
// 			if user.Email != email {
// 				data = append(data, user)
// 			}
// 		}
// 		response := map[string]interface{}{"event": "broadcastAllUsers", "data": data}
// 		err := client.WriteJSON(response)
// 		if err != nil {
// 			log.Println(err)
// 		}
// 	}
// }

// func BroadcastAllUsers(email string) {
// 	// Iterate through all connected clients and send the message
// 	clientsMutex.Lock()
// 	defer clientsMutex.Unlock()
// 	var test []models.UserList
// 	var user models.User
// 	for client, tab := range SocketClients { //send data
// 		_, email := []models.User{}, tab[0]
// 		if err := models.UserRepo.GetUser(&user, email); err != nil {
// 			fmt.Println("Error getting user: ", err)
// 			return
// 		}
// 		fmt.Println("User: ", user)
// 		users, err := models.UserRepo.GetUsersList(user.Id)
// 		test = users
// 		if err != nil {
// 			fmt.Println("Error getting users", err)
// 			return
// 		}
// 		response := map[string]interface{}{"event": "broadcastAllUsers", "data": users}
// 		err = client.WriteJSON(response)
// 		if err != nil {
// 			log.Println(err)
// 		}
// 	}
// 	for _, user := range test {
// 		fmt.Println("User: ", user)
// 	}
// }

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
		fmt.Println("test2")
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
	for client, _ := range SocketClients { //send data
		response := map[string]interface{}{"event": "broadcastAllCategories", "data": categories}
		err := client.WriteJSON(response)
		if err != nil {
			log.Println(err)
		}
	}
}
func BroadcastChat(senderId, receiverId int, senderAdress, receverAdress string) {
	data, err := models.MessageRepo.Get(senderId, receiverId)
	if err != nil {
		fmt.Println("Error loading chat messages: ", err)
		return
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
