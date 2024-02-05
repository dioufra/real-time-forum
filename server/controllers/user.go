package controllers

import (
	"database/sql"
	"net/http"
	"real-time-forum/server/models"
)

func GetUser(res http.ResponseWriter, req *http.Request) {

}
func GetUserByField(db *sql.DB, field string, value string) (user models.User, err error) {

	req := `SELECT id,firstname,lastname,email,username from Users Where ` + field + `='` + value + `';`
	row, err := db.Query(req)
	for row.Next() {
		row.Scan(&user.Id, &user.Firstname, &user.Lastname, &user.Email, &user.Username)
	}
	return
}
