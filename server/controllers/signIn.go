package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

func SignIn(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from sign in")
	if req.Method != http.MethodPost {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var userLogin models.UserLogin
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&userLogin); err != nil {
		fmt.Println(err)
		http.Error(res, "Invalid request payload", http.StatusBadRequest)
		return
	}

	ok, user, err := helper.ValidateCredential(userLogin)
	if err != nil {
		fmt.Println("Error retrieving the user")
		return
	}

	// might consider creating a response function
	if !ok {
		fmt.Println("Wrong credential")
		if err := json.NewEncoder(res).Encode(map[string]any{"message": "wrong credential", "user": models.UserResponseData{}}); err != nil {
			log.Println("Error encoding JSON response:", err)
		}
		return
	}

	fmt.Println("login successfull")
	sessionId := helper.SetCookie(res)

	errSession := helper.SessionAddOrUpdate(DB, sessionId, user.Email)
	if errSession != nil {
		fmt.Println(errSession)
		return
	}

	authUser := models.UserResponseData{
		Id:        user.Id,
		IsAuth:    true,
		Firstname: user.Firstname,
		Lastname:  user.Lastname,
	}

	posts, err := models.PostRepo.GetAllPost()
	if err != nil {
		fmt.Println("Error getting posts", err)
		return
	}

	_, postCats := models.CategoryRepo.GetPostCategories()

	fmt.Println(postCats)

	categories, err := models.CategoryRepo.GetCategories()

	if err != nil {
		fmt.Println("Error retrieving categories: ", err)
	}
	res.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(res).Encode(map[string]any{"message": "Login successful", "user": authUser, "posts": posts, "categories": categories}); err != nil {
		log.Println("Error encoding JSON response:", err)
	}

	defer req.Body.Close()
}
