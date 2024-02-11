package models

import "database/sql"

var (
	UserRepo         *UserRepository
	PostRepo         *PostRepository
	CommentRepo      *CommentRepository
	CategoryRepo     *CategoryRepository
	AppreciationRepo *AppreciationRepository
	MessageRepo      *MessageRepository
	// PostCategoryRepo *PostCategoryRepository
)

func AddRepositories(db *sql.DB) {
	UserRepo = NewUserRepository(db)
	PostRepo = NewPostRepository(db)
	CategoryRepo = NewCategoryRepository(db)
	CommentRepo = NewCommentRepository(db)
	AppreciationRepo = NewAppreciationRepository(db)
	MessageRepo = NewMessageRepository(db)

}
