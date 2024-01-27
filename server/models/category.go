package models

import (
	"database/sql"
)

type Category struct {
	Id   int
	Name string
}

type PostCategory struct {
	Id     int
	CatId  int
	PostId int
}

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

func (r *CategoryRepository) GetCategories() ([]Category, error) {
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

func (r *CategoryRepository) GetPostCategories() ([]PostCategory, error) {
	var postCategories []PostCategory
	req := `SELECT pc.id, pc.Cat_id, pc.Pos_id FROM Post_Category pc`
	row, err := r.db.Query(req)
	if err != nil {
		return postCategories, err
	}
	for row.Next() {
		var postCategory PostCategory
		row.Scan(&postCategory.Id, &postCategory.CatId, &postCategory.PostId)
		postCategories = append(postCategories, postCategory)
	}
	return postCategories, row.Err()
}
