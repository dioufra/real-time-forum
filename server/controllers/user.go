package controllers

import (
	"database/sql"
	"net/http"
	"real-time-forum/server/models"
)

func GetUser(res http.ResponseWriter, req *http.Request) {

}
func GetUserByEmail(db *sql.DB, email string) (user models.User, err error) {

	req := `SELECT firstname,lastname,email from Users Where email='` + email + `';`
	row, err := db.Query(req)
	for row.Next() {
		row.Scan(&user.Firstname, &user.Lastname, &user.Email)
	}
	return
}
