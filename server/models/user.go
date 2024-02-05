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
