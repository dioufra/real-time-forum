package controllers

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
)

var DB *sql.DB

func Home(res http.ResponseWriter, req *http.Request) {
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
