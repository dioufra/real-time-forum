package models

import (
	"database/sql"
)

type User struct {
	Id        int    `json:"id"`
	Firthname string `json:"firthname"`
	Lastname  string `json:"lastname"`
	Username  string `json:"username"`
	Gender    string `json:"gender"`
	Age       string `json:"age"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UserData struct {
	Error  string `json:"error"`
	User   User   `json:"user"`
	IsAuth bool   `json:"isAuth"`
}

func (user *User) Create(DB *sql.DB, email string) error {
	return nil
}

func (user *User) Get(DB *sql.DB, email string) error {
	return nil
}

func (user *User) GetAll() {}
