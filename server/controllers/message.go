package controllers

import (
	"net/http"
	"real-time-forum/server/models"
)

var MESSAGES_TAB []models.Message

func SendMessage(res http.ResponseWriter, req *http.Request) {

	defer req.Body.Close()
}
