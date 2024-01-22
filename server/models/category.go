package models

type Category struct {
	Id     int
	Name   string
}

type PostCategory struct {
	Category Category
	PostId int
}


func GetPostCategory() {}
