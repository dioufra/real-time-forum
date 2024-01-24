package models

import (
	"database/sql"
	"time"
)

type Post struct {
	Id         int
	User_id    int
	Title      string
	Content    string
	Image      string
	Categories []string
	Date       time.Time
}

type PostData struct {
	Post        Post `json:"Post"`
	User        User `json:"User"`
	NbrLike     int  `json:"Nbrlike"`
	NbrDislike  int  `json:"NbrDislike"`
	NbrComments int  `json:"NbrComments"`
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{
		db: db,
	}
}

type Posts []PostData

func (r *PostRepository) GetAllPost(cat_id int) (Posts, error) {
	var posts Posts
	req := `
			SELECT p.id, p.title, p.content, p."date", u.username,
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
			FROM "Post" p
			JOIN "User" "u" ON p.Use_id = u.id  where pt."Cat_id"=? ORDER BY p.id DESC
			`
	row, err := r.db.Query(req)
	if err != nil {
		return posts, err
	}

	for row.Next() {
		var user User
		var post Post
		postData := PostData{User: user, Post: post}
		row.Scan(&postData.Post.Id, &postData.Post.Title, &postData.Post.Date, &postData.User.Username, &postData.NbrLike, &postData.NbrDislike, &postData.NbrComments)
		posts = append(posts, postData)
	}
	return posts, row.Err()
}

func (r *PostRepository) GetPostsByUser(user User) (Posts, error) {
	var posts Posts
	req := `
			SELECT p.id, p.title,p.content,p."date",u.username, 
				(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
			FROM "Post" "p"
			JOIN "User" "u" ON p.Use_id=u.id
			WHERE u.id = ? ORDER BY p.id DESC
		`
	row, err := r.db.Query(req, user.Id)
	if err != nil {
		return posts, err
	}

	for row.Next() {
		var user User
		var post Post
		postData := PostData{User: user, Post: post}
		row.Scan(&postData.Post.Id, &postData.Post.Title, &postData.Post.Date, &postData.User.Username, &postData.NbrLike, &postData.NbrDislike, &postData.NbrComments)
		posts = append(posts, postData)
	}
	return posts, row.Err()
}

func (r *PostRepository) GetPostsByCatId(cat_id string) (Posts, error) {
	var posts Posts
	req := `
			SELECT p.id, p.title, p.content, p."date", u.username,
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
			FROM "Post" p
			LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
			JOIN "User" "u" ON p.Use_id = u.id  where pt."Cat_id"=? ORDER BY p.id DESC
			`
	row, err := r.db.Query(req)
	if err != nil {
		return posts, err
	}

	for row.Next() {
		var user User
		var post Post
		postData := PostData{User: user, Post: post}
		row.Scan(&postData.Post.Id, &postData.Post.Title, &postData.Post.Date, &postData.User.Username, &postData.NbrLike, &postData.NbrDislike, &postData.NbrComments)
		posts = append(posts, postData)
	}
	return posts, row.Err()
}

func (r *PostRepository) CreatePost(title, content string, user_id int, categories_id []int) error {
	req := `INSERT INTO Post (Use_id, title, content, date) VALUES (?, ?, ?, ?);`
	result, err := r.db.Exec(req, user_id, title, content, time.Now())
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	for _, _id := range categories_id {
		req = `INSERT INTO Post_Category (Post_id, Cat_id) VALUES (?, ?);`
		_, err = r.db.Exec(req, id, _id)
		if err != nil {
			return err
		}
	}
	return nil
}

func (r *PostRepository) GetLikedPost() {}

func (r *PostRepository) GetPostByCatId() {}
