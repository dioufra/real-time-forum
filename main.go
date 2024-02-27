package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"real-time-forum/server/config"
	"real-time-forum/server/controllers"
	"real-time-forum/server/models"
	"real-time-forum/server/router"
)

func init() {
	var err error
	controllers.DB, err = config.GetDB()
	if err != nil {
		fmt.Println("connection database Error", err)
		os.Exit(0)
	}

	models.AddRepositories(controllers.DB)

	tabRequest := []string{
		`CREATE TABLE IF NOT EXISTS Users (
			id          integer  not null,
			firstname 	varchar(250) ,
			lastname	varchar(250),
			age			varchar(250),
			gender		varchar(250),
			username	varchar(250),
			email		varchar(250),
			password	varchar(250),
			constraint  PK_SESS primary key (id)
		);`,
		`CREATE TABLE IF NOT EXISTS Session (
			id          integer  not null,
			sessionId 	varchar(250) ,
			email		varchar(250),
			datefin		TIMESTAMP,
			constraint  PK_SESS primary key (id)
		);`,
		`CREATE TABLE IF NOT EXISTS Message (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			sender_id INTEGER NOT NULL,
			receiver_id INTEGER NOT NULL,
			content VARCHAR(255) NOT NULL,
			is_read BOOLEAN DEFAULT FALSE,
			date TIMESTAMP NOT NULL,
			CONSTRAINT FK_Message_Sender FOREIGN KEY (sender_id) REFERENCES "Users" (id),
			CONSTRAINT FK_Message_Receiver FOREIGN KEY (receiver_id) REFERENCES "Users" (id)
		);`,
	}
	for _, req := range tabRequest {
		_, queryErr := controllers.DB.Exec(req)
		if queryErr != nil {
			log.Println("🚨 Error during table creation: ", queryErr)
			os.Exit(0)
		}
	}

	log.Println("✅ Initialisation successful")

}

var PORT = ":8080"

func main() {

	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
	http.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("./public/"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./public/img/"))))

	router.Route()

	fmt.Println("Listening in http://localhost" + PORT)
	err := http.ListenAndServe(PORT, nil)
	if err != nil {
		fmt.Println("ListenAndServe: ", err)
		return
	}

	defer controllers.DB.Close()

}
