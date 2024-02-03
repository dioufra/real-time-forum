package models

import (
	"database/sql"
	"time"
)

type CommentInfo struct {
	Id       int
	UserId   int
	Username string
	PostId   int
	Content  string
	Like     int
	Dislike  int
	Date     time.Time
}

type Comment struct {
	PostId  int
	UserId  int
	Content string
	Date    int
}

type FetchComment struct {
	PostId  int    `json:"post_id"`
	UserId  int    `json:"Use_id"`
	Content string `json:"comment"`
	Date    int    `json:"date"`
}

type CommentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) *CommentRepository {
	return &CommentRepository{
		db: db,
	}
}

// get comment from  post id
func (r *CommentRepository) GetCommentsFromPostId(post_id int) ([]CommentInfo, error) {
	var comments []CommentInfo
	req := `SELECT c.id, c.content, u.username,
				(SELECT count(id) FROM "Appreciation" a WHERE a."Com_id" = c.id AND like = 1) as like,
				(SELECT count(id) FROM "Appreciation" a WHERE a."Com_id" = c.id AND dislike = 1) as dislike
			FROM "Comment" c 
			INNER JOIN "Users" u on c."Use_id"=u.id  WHERE c."Pos_id"=?;`
	row, err := r.db.Query(req, post_id)
	if err != nil {
		return comments, err
	}
	for row.Next() {

		comment := CommentInfo{}
		row.Scan(&comment.Id, &comment.Content, &comment.Username, &comment.Like, &comment.Dislike)
		formate := time.Now().Sub(comment.Date.Local())
		comment.Date = time.Date(0, 0, 0, int(formate.Hours()), int(formate.Minutes()), int(formate.Seconds()), int(formate.Milliseconds()), time.UTC)
		comments = append(comments, comment)
	}
	return comments, row.Err()
}

func (r *CommentRepository) Create(post_id, user_id int, content string, date time.Time) error {
	req := `INSERT INTO Comment (Use_id,Pos_id,content, date) VALUES(?,?,?, ?);`
	_, err := r.db.Exec(req, user_id, post_id, content, date)
	return err
}
