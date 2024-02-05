package models

import "time"

type Message struct {
	ID             int
	SenderId       int
	ReceiverId     int
	Content        string
	Date           time.Time
	SenderAdress   string //ne pas enregister dans la base de donnees
	ReceiverAdress string //ne pas enregister dans la base de donnees
}
