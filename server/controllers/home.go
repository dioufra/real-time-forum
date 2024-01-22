package controllers

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
)

var DB *sql.DB

func Home(res http.ResponseWriter, req *http.Request) {
	// isAuth, email := helper.Auth(DB, req)
	// var user models.User
	// var err error
	// if isAuth {
	// 	if err := user.Get(DB, email); err != nil {
	// 		log.Println("🚨 Error: ", err)
	// 		return
	// 	}
	// }
	files := []string{"./public/index.html"}
	tpl, err := template.ParseFiles(files...)
	if err != nil {
		log.Println("🚨 " + err.Error())
		res.WriteHeader(http.StatusInternalServerError)
		return
	} else {
		tpl.Execute(res, nil)
	}
	log.Println("✅ Successfully get the home page")
}
