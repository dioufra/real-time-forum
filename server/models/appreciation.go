package models

import (
	"database/sql"
	"fmt"
	"time"
)

type Appreciation struct {
	Id        int
	Like      int
	Dislike   int
	UserId    int
	PostId    int
	CommentId int
	Date      time.Time
}

type AppreciationRepository struct {
	db *sql.DB
}

func NewAppreciationRepository(db *sql.DB) *AppreciationRepository {
	return &AppreciationRepository{
		db: db,
	}
}

func (r *AppreciationRepository) AddForPost(user_id, post_id, like, dislike int) error {
	appr, err := getByPostAndUser(r, post_id, user_id)
	if err != nil {
		return err
	}

	if appr.UserId != user_id {
		req := `INSERT INTO Appreciation (Use_id,Pos_id,like, dislike) VALUES(?,?,?,?);`
		_, err := r.db.Exec(req, user_id, post_id, like, dislike)
		return err
	}
	if like > 0 {
		if like+appr.Like > 1 {
			return Update(r.db, user_id, post_id, 0, "like")
		} else {
			Update(r.db, user_id, post_id, 1, "like")
			return Update(r.db, user_id, post_id, 0, "dislike")
		}
	} else if dislike > 0 {
		if dislike+appr.Dislike > 1 {
			return Update(r.db, user_id, post_id, 0, "dislike")
		} else {
			Update(r.db, user_id, post_id, 0, "like")
			return Update(r.db, user_id, post_id, 1, "dislike")
		}
	}
	return nil
}

func (r *AppreciationRepository) AddForComment(user_id, com_id, like, dislike int) error {
	fmt.Println("adding appreciation to comments")
	appr, err := getByCommentAndUser(r, com_id, user_id)
	if err != nil {
		return err
	}

	if appr.UserId != user_id {
		req := `INSERT INTO Appreciation (Use_id, Com_id ,Pos_id,like, dislike) VALUES(?,?,?,?,?);`
		_, err := r.db.Exec(req, user_id, com_id, 0, like, dislike)
		return err
	}
	if like > 0 {
		if like+appr.Like > 1 {
			return UpdateComment(r.db, user_id, com_id, 0, "like")
		} else {
			UpdateComment(r.db, user_id, com_id, 1, "like")
			return UpdateComment(r.db, user_id, com_id, 0, "dislike")
		}
	} else if dislike > 0 {
		if dislike+appr.Dislike > 1 {
			return UpdateComment(r.db, user_id, com_id, 0, "dislike")
		} else {
			UpdateComment(r.db, user_id, com_id, 0, "like")
			return UpdateComment(r.db, user_id, com_id, 1, "dislike")
		}
	}
	return nil
}

func getByPostAndUser(r *AppreciationRepository, post_id int, user_id int) (Appreciation, error) {
	appr := Appreciation{}
	req := `SELECT id, Use_id, like, dislike FROM Appreciation WHERE Pos_id=? AND Use_id=?;`
	row, err := r.db.Query(req, post_id, user_id)
	if err != nil {
		return Appreciation{}, err
	}
	for row.Next() {
		row.Scan(&appr.Id, &appr.UserId, &appr.Like, &appr.Dislike)
	}
	return appr, row.Err()
}

func getByCommentAndUser(r *AppreciationRepository, com_id int, user_id int) (Appreciation, error) {
	appr := Appreciation{}
	req := `SELECT id, Use_id, like, dislike FROM Appreciation WHERE Com_id=? AND Use_id=?;`
	row, err := r.db.Query(req, com_id, user_id)
	if err != nil {
		return Appreciation{}, err
	}
	for row.Next() {
		row.Scan(&appr.Id, &appr.UserId, &appr.Like, &appr.Dislike)
	}
	return appr, row.Err()
}


func Update(db *sql.DB, user_id, post_id, value int, colone string) error {
	req := `UPDATE Appreciation SET ` + colone + `=? WHERE Use_id=? AND  Pos_id=?;`
	_, err := db.Exec(req, value, user_id, post_id)
	return err
}

func UpdateComment(db *sql.DB, user_id, com_id, value int, colone string) error {
	req := `UPDATE Appreciation SET ` + colone + `=? WHERE Use_id=? AND  Com_id=?;`
	_, err := db.Exec(req, value, user_id, com_id)
	return err
}
