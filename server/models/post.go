package models

import "time"

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
	Post     Post
	User     User
	Likes    int
	Dislikes int
	Comments int
}

type AllPosts []Post

func (post *Post) GetAllPost() {}

func (post *Post) GetUserPosts() {}

func (post *Post) CreatePost() {}

func (post *Post) GetLikedPost() {}
