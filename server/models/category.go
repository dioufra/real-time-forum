package models

type Category struct {
	Id   int
	Name string
}

type Categories []Category

type PostCategory struct {
	Category Category
	PostId   int
}

// func (r *CatRepository) GetCategory() {

// }

func GetPostCategory() {}
