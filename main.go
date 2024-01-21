package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"real-time-forum/server/config"
	"real-time-forum/server/controllers"
	"real-time-forum/server/router"
)

var PORT = ":8080"

func init() {
	var err error
	controllers.DB, err = config.GetDB()
	if err != nil {
		fmt.Println("connection database Error", err)
		os.Exit(0)
	}
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
		`CREATE TABLE IF NOT EXISTS Sessions (
			id          integer  not null,
			sessionId 	varchar(250) ,
			email		varchar(250),
			datefin		TIMESTAMP,
			constraint  PK_SESS primary key (id)
		);`,
	}
	for _, req := range tabRequest {
		_, queryErr := controllers.DB.Exec(req)
		if queryErr != nil {
			log.Println("🚨 Error during table creation: ", queryErr)
			os.Exit(0)
		}
	}
	log.Println("✅ Successfully created session table")

}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
func main() {

	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./public/img/"))))
	http.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("./public/"))))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/"))))

	// Enable CORS globally for all routes
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.DefaultServeMux.ServeHTTP(w, r)
	})
	// add routes by either importing them or using them directly here
	router.Route()

	fmt.Println("Listening in http://localhost" + PORT)

	http.ListenAndServe(PORT, handler)

	defer controllers.DB.Close()

}
