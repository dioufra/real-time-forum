package models

import (
	"database/sql"
	"fmt"
	"time"
)

type Session struct {
	Id        string
	SessionId string
	Email     string
	EndDate   time.Time
}

type SessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{
		db: db,
	}
}

func (r *SessionRepository) DeleteSession(value string) error {
	req := `DELETE from Session Where sessionId=?;`
	_, err := r.db.Exec(req, value)
	return err
}

//	func (r *SessionRepository) AddSession(sessionId string) error {
//		req := `INSERT INTO from Session Where sessionId=?;`
//		_, err := r.db.Exec(req, sessionId)
//		return err
//	}

func (r *SessionRepository) GetSessionFromEmail(db *sql.DB, sssid, useremail string) (Session, error) {
	var session Session
	req := `SELECT sessionId, email, datefin from Session Where email='` + useremail + `';`
	row, err := db.Query(req)
	if err != nil {
		return session, err
	}

	for row.Next() {
		row.Scan(&session.SessionId, &session.Email, &session.EndDate)

	}
	return session, err
}

func (r *SessionRepository) UpdateSession(sssid, useremail string) error {
	req := `SELECT sessionId, email, datefin from Session Where email='` + useremail + `';`
	row, err := r.db.Query(req)
	var sessionid, email string
	var datef time.Time
	var errsession error
	if err != nil {
		fmt.Println(err)
		return err
	}

	for row.Next() {
		row.Scan(&sessionid, &email, &datef)

	}

	if email == useremail {
		_, errsession = r.db.Exec("UPDATE Session SET sessionId=?, datefin=? where sessionId=? AND email=?;", sssid, time.Now().Add(time.Hour*24*3), sssid, email)
	} else {
		_, errsession = r.db.Exec("INSERT INTO Session (sessionId,email,datefin) VALUES(?,?,?);", sssid, useremail, time.Now().Add(time.Hour*24*3))
	}
	return errsession

}
