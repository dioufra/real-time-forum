package models

import (
	"database/sql"
)

type UserLogin struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type User struct {
	Id             int    `json:"id"`
	Firstname      string `json:"firstname"`
	Lastname       string `json:"lastname"`
	Username       string `json:"username"`
	Gender         string `json:"gender"`
	Age            string `json:"age"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	RepeatPassword string `json:"repeatpassword"`
	Type           string `json:"receiver"`
	UnReadMessages int    `json:"unread_mesages"`
}

type UserList struct {
	Id             int    `json:"id"`
	Firstname      string `json:"firstname"`
	Lastname       string `json:"lastname"`
	Username       string `json:"username"`
	Gender         string `json:"gender"`
	Age            string `json:"age"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	RepeatPassword string `json:"repeatpassword"`
	Type           string `json:"receiver"`
}

type UserData struct {
	Error  string `json:"error"`
	User   User   `json:"user"`
	IsAuth bool   `json:"isAuth"`
}

type UserRepository struct {
	DB *sql.DB
}

func (r *UserRepository) Create(user User) (sql.Result, error) {
	insertQuery := "INSERT INTO Users (firstname,lastname, gender, age, username,email, password) VALUES (?, ?, ?, ?, ?, ?, ?)"
	result, err := r.DB.Exec(insertQuery, user.Firstname, user.Lastname, user.Gender, user.Age, user.Username, user.Email, user.Password)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (r *UserRepository) GetUser(user *User, login string) error {
	req := `SELECT id, email, lastName, firstName, password, username from Users Where email=? OR username=?`
	row, err := r.DB.Query(req, login, login)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&user.Id, &user.Email, &user.Lastname, &user.Firstname, &user.Password, &user.Username)
	}
	return nil
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		DB: db,
	}
}

func (r *UserRepository) GetAll() ([]User, error) {
	var users []User
	req := `SELECT id, firstname, lastname, username, gender, age, email FROM Users`
	row, err := r.DB.Query(req)
	if err != nil {
		return nil, err
	}
	for row.Next() {
		var user User
		row.Scan(&user.Id, &user.Firstname, &user.Lastname, &user.Username, &user.Gender, &user.Age, &user.Email)
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepository) GetUsersList(id int) ([]UserList, error) {
	var users []UserList
	req := `
	SELECT * FROM (
		SELECT u.id, u.username, u.firstname, u.lastname, 'Receiver' AS user_type 
		FROM "Users" u
		WHERE u.id IN (
			SELECT m.receiver_id
			FROM message m
			WHERE m.sender_id = ?
			UNION
			SELECT m.sender_id
			FROM message m
			WHERE m.receiver_id = ?
		)
		ORDER BY (
			SELECT MAX(date)
			FROM message m 
			WHERE m.sender_id = u.id OR m.receiver_id = u.id
		) DESC
	)
	UNION ALL
	SELECT * FROM (
		SELECT u.id, u.username, u.firstname, u.lastname, 'NotReceiver' AS user_type 
		FROM "Users" u
		WHERE  u.id NOT IN (
			SELECT sender_id FROM message WHERE receiver_id = ?
			UNION
			SELECT receiver_id FROM message WHERE sender_id = ?
		) AND u.id != ?
		ORDER BY u.username
	)	
	`
	row, err := r.DB.Query(req, id, id, id, id, id)
	if err != nil {
		return nil, err
	}
	for row.Next() {
		var user UserList
		row.Scan(&user.Id, &user.Username, &user.Firstname, &user.Lastname, &user.Type)
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepository) GetUserByEmail(user *User, email string) error {
	req := `SELECT id, email, lastName, firstName, username from Users Where email=?`
	row, err := r.DB.Query(req, email)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&user.Id, &user.Email, &user.Lastname, &user.Firstname, &user.Username)
	}
	return nil
}

func (r *UserRepository) GetUserById(user *User, id int) error {
	req := `SELECT id, email, lastName, firstName, username from Users Where id=?`
	row, err := r.DB.Query(req, id)
	if err != nil {
		return err
	}
	for row.Next() {
		row.Scan(&user.Id, &user.Email, &user.Lastname, &user.Firstname, &user.Username)
	}
	return nil
}
