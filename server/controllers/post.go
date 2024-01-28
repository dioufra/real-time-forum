package controllers

import (
	"fmt"
	"net/http"
)

func CreatePost(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("hello from create post"))
}

func GetPost(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Getting post")
	res.Write([]byte("hello from get post"))

}

func GetAllPost(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("hello from all posts"))

}

// func ValidePost(res http.ResponseWriter, req *http.Request) {}
