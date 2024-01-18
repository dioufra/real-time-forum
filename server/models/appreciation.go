package models

import "time"

type Appreciation struct {
	Id        int
	UserId    int
	PostId    int
	CommentId int
	Date      time.Time
}



func (appreciation *Appreciation) Create() {} // or add

func (appreciation *Appreciation) Get() {}

func (appreciation *Appreciation) Update() {}