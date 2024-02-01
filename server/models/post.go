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
	Categories string
	Date       time.Time
}

type PostData struct {
	Post        Post `json:"Post"`
	User        User `json:"User"`
	NbrLike     int  `json:"Nbrlike"`
	NbrDislike  int  `json:"NbrDislike"`
	NbrComments int  `json:"NbrComments"`
}

type PostInfo struct {
	Id          int
	User_id     int
	Username    string
	Title       string
	Content     string
	Image       string
	Categories  string
	Date        time.Time
	NbrLike     int
	NbrDislike  int
	NbrComments int
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

func (r *PostRepository) GetAllPost() ([]PostInfo, error) {
	var posts []PostInfo
	req := `
			SELECT p.id, p.title, p.content, p."date", u.username,
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments",
				( SELECT GROUP_CONCAT("c"."name", ', ') FROM "Category" "c" JOIN "Post_Category" "pc" ON "c"."id" = "pc"."Cat_id" WHERE "pc"."Pos_id" = p.id) as "Categories"
			FROM "Post" p
			JOIN "Users" "u" ON p.Use_id = u.id ORDER BY p.id DESC
			`
	row, err := r.db.Query(req)
	if err != nil {
		return posts, err
	}

	for row.Next() {
		// postData := PostData{User: User{}, Post: Post{}}
		var postData PostInfo
		row.Scan(&postData.Id, &postData.Title, &postData.Content, &postData.Date, &postData.Username, &postData.NbrLike, &postData.NbrDislike, &postData.NbrComments, &postData.Categories)
		posts = append(posts, postData)
	}
	return posts, row.Err()
}

func (r *PostRepository) GetPostById(postID int) (PostInfo, error) {
	var post PostInfo
	req := `
			SELECT p.id, p.title, p.content, p."date", u.username,
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments",
				( SELECT GROUP_CONCAT("c"."name", ', ') FROM "Category" "c" JOIN "Post_Category" "pc" ON "c"."id" = "pc"."Cat_id" WHERE "pc"."Pos_id" = p.id) as "Categories"
			FROM "Post" p
			JOIN "Users" "u" ON p.Use_id = u.id
			WHERE p.id = ?
			ORDER BY p.id DESC
			`

	row := r.db.QueryRow(req, postID)
	err := row.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.Username, &post.NbrLike, &post.NbrDislike, &post.NbrComments, &post.Categories)

	return post, err
}


func (r *PostRepository) GetPostsByUser(user User) (Posts, error) {
	var posts Posts
	req := `
			SELECT p.id, p.title,p.content,p."date",u.username, 
				(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				(SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				(SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
			FROM "Post" "p"
			JOIN "Users" "u" ON p.Use_id=u.id
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
			JOIN "Users" "u" ON p.Use_id = u.id  where pt."Cat_id"=? ORDER BY p.id DESC
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


func (r *PostRepository) GetPostsById(post_id string) (Posts, error) {
	var posts Posts
	req := `
			SELECT p.id, p.title, p.content, p."date", u.username,
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "like"=1) as "likes",
				( SELECT count(*) FROM "Appreciation" "a" WHERE p.id=a."Pos_id" AND "dislike"=1) as "dislikes",
				( SELECT count(*) FROM "Comment" "c" WHERE p.id=c."Pos_id" ) as "Comments"
			FROM "Post" p
			LEFT JOIN "Post_Category" pt on  pt."Pos_id"=p.id
			JOIN "Users" "u" ON p.Use_id = u.id  where pt."post_id"=? ORDER BY p.id DESC
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
