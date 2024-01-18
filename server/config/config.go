package config

import (
	"database/sql"
	_"github.com/mattn/go-sqlite3"
)

func GetDB() (db *sql.DB, err error) {

	return sql.Open("sqlite3", "server/data/sql/db.sqlite")
}

func GetDBSession() (db *sql.DB, err error) {

	return sql.Open("sqlite3", ":memory:")
}
