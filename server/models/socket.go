package models

import (
	"fmt"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

func BroadCastContactedUser(client *websocket.Conn, email string) {
	var user User
	if err := UserRepo.GetUserByEmail(&user, email); err != nil {
		fmt.Println("user not found")
		return
	}
	users, err := UserRepo.GetContactedUsers(user.Id)
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

// clientsMutex sync.Mutex
func BroadCastAllUsers(client *websocket.Conn, email string) {
	// clientsMutex.Lock()
	// defer clientsMutex.Unlock()
	var user User
	if err := UserRepo.GetUser(&user, email); err != nil {
		fmt.Println("Error getting user: ", err)
		return
	}
	users, err := UserRepo.GetUsersList(user.Id)
	if err != nil {
		fmt.Println("Error getting users", err)
		return
	}
	for _, _user := range users {
		nb, err := MessageRepo.GetUnReadMessages(_user.Id, user.Id)
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

func BroadCastAllPosts(client *websocket.Conn, email string) {
	posts, err := PostRepo.GetAllPost()
	if err != nil {
		fmt.Println("Error getting posts", err)
		return
	}
	response := map[string]interface{}{"event": "broadcastAllPosts", "data": posts}
	if err := client.WriteJSON(response); err != nil {
		fmt.Println("Error")
		log.Println(err)
	}
}

func BroadcastAllCategories(client *websocket.Conn, email string) {
	// Iterate through all connected clients and send the message
	categories, err := CategoryRepo.GetCategories()
	if err != nil {
		fmt.Println("Error retrieving categories: ", err)
		return
	}

	response := map[string]interface{}{"event": "broadcastAllCategories", "data": categories}
	if err := client.WriteJSON(response); err != nil {
		log.Println(err)
	}
}

func GetConnectionByEmail(email string, clientsMutex *sync.Mutex, clients map[*websocket.Conn][]string) *websocket.Conn {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for conn, info := range clients {
		if len(info) >= 1 && info[0] == email {
			return conn
		}
	}
	return nil // If no connection found for the given email
}
