package controllers

import (
	"fmt"
	"net/http"
)

func AddPost(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from post creation")
}

func GetPost(res http.ResponseWriter, req *http.Request) {}

func GetAllPost(res http.ResponseWriter, req *http.Request) {}

// func ValidePost(res http.ResponseWriter, req *http.Request) {}
