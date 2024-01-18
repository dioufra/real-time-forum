package models

type Comment struct {
	Id       int
	UserId   int
	UserName string
	PostId   int
	Content  string
	Like     int
	Dislike  int
}

// get comment from  post id
func (comment *Comment) GetFromPostId() {}

func (comment *Comment) Create() {}
