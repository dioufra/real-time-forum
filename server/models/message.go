package models

import "time"

type Message struct {
	ID         int
	SenderId   int
	ReceiverId int
	Content    string
	Date       time.Time
}
