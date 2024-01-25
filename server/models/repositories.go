package models

import "database/sql"

var (
	UserRepo *UserRepository
	PostRepo *PostRepository
	// CommentRepo      *CommentRepository
	CategoryRepo *CategoryRepository
	// PostCategoryRepo *PostCategoryRepository
	// MessageRepo      *MessageRepository
)

func AddRepositories(db *sql.DB) {
	UserRepo = NewUserRepository(db)
	PostRepo = NewPostRepository(db)
	CategoryRepo = NewCategoryRepository(db)
}
