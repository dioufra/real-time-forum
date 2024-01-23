package controllers

import (
	"encoding/json"
	"fmt"
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
	var user models.User
	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(&userLogin); err != nil {
		fmt.Println(err)
		http.Error(res, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := models.UserRepo.GetUser(&user, userLogin.Login); err != nil {
		fmt.Println("Error: ", err)
		return
	}
	if !helper.IsPasswordsMatch(user.Password, userLogin.Password) {
		fmt.Println("Wrong credentials")
		return
	}

	// sessionId := u1.String() + "-" + time.Now().GoString()
	// cookie := http.Cookie{
	// 	Name:     "sessionid",
	// 	Value:    sessionId,
	// 	Expires:  time.Now().Add(time.Hour * 24 * 3),
	// 	Path:     "/",
	// 	MaxAge:   3600 * 24 * 3,
	// 	HttpOnly: true,
	// 	Secure:   true,
	// 	SameSite: http.SameSiteLaxMode,
	// }
	// http.SetCookie(res, &cookie)

	sessionId := helper.SetCookie(res)

	errSession := helper.SessionAddOrUpdate(DB, sessionId, user.Email)
	if errSession != nil {
		fmt.Println(errSession)
		return
	}

	users, err := models.UserRepo.GetAll()
	if err != nil {
		fmt.Println("Error retrieving users", err)
		return
	}

	fmt.Println(users)

	defer req.Body.Close()
}
