package models

import "database/sql"

type Category struct {
	Id   int
	Name string
}

type Categories []Category

type PostCategory struct {
	Category Category
	PostId   int
}

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

// func (r *CatRepository) GetCategory() {

// }

func (r CategoryRepository) GetPostCategory() ([]Category, error) {
	var categories []Category
	req := `SELECT id, name FROM Category`

	row, err := r.db.Query(req)

	if err != nil {
		return categories, err
	}

	for row.Next() {
		var category Category
		row.Scan(&category.Id, &category.Name)
		categories = append(categories, category)
	}
	return categories, err
}
