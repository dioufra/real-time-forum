package controllers

import (
	"fmt"
	"net/http"
)

func Appreciation(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Hello from appreciation")
}
