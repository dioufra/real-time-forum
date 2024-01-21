package controllers

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"real-time-forum/server/helper"
	"real-time-forum/server/models"
)

var DB *sql.DB

func Home(res http.ResponseWriter, req *http.Request) {
	isAuth, email := helper.Auth(DB, req)
	var user models.User
	// var err error
	if isAuth {
		if err := user.Get(DB, email); err != nil {
			log.Println("🚨 Error: ", err)
			return
		}
	}
	files := []string{"./index.html"}
	tpl, err := template.ParseFiles(files...)
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println("🚨 " + err.Error())
	} else {
		tpl.Execute(res, nil)
	}
	log.Println("✅ Successfully get the home page")
}
