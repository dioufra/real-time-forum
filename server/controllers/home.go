package controllers

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"real-time-forum/server/helper"
)

var DB *sql.DB

func Home(res http.ResponseWriter, req *http.Request) {
	if (req.Method != http.MethodGet) {
		helper.HandleError(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
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
