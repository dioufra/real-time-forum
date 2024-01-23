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
	Post        Post `json:"Post"`
	NbrLike     int  `json:"Nbrlike"`
	NbrDislike  int  `json:"NbrDislike"`
	NbrComments int  `json:"NbrComments"`
}


type AllPosts []PostData

func (post *Post) GetAllPost() {}

func (post *Post) GetUserPosts() {}

func (post *Post) CreatePost() {}

func (post *Post) GetLikedPost() {}
