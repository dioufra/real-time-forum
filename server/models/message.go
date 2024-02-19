package models

import (
	"database/sql"
	"time"
)

type Message struct {
	ID             int
	SenderId       int
	ReceiverId     int
	Content        string
	Date           time.Time
	SenderAdress   string //ne pas enregister dans la base de donnees
	ReceiverAdress string //ne pas enregister dans la base de donnees
	ChatId         int
}

type MessageRepository struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) *MessageRepository {
	return &MessageRepository{
		db: db,
	}
}

func (r *MessageRepository) Add(message *Message) error {
	req := `INSERT INTO Message (sender_id, receiver_id, content, date) VALUES(?,?,?,?)`
	_, err := r.db.Exec(req, message.SenderId, message.ReceiverId, message.Content, message.Date)
	if err != nil {
		return err
	}
	return nil
}

func (r *MessageRepository) Get(senderId int, receiverId int) ([]Message, error) {
	req := `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.date
			FROM "Message" m 
			WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
			ORDER By m.date ASC
			`
	var messages []Message
	row, err := r.db.Query(req, senderId, receiverId, receiverId, senderId)
	if err != nil {
		return messages, err
	}
	for row.Next() {
		var message Message
		row.Scan(&message.ID, &message.SenderId, &message.ReceiverId, &message.Content, &message.Date)
		messages = append(messages, message)
	}
	return messages, row.Err()
}
