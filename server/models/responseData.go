package models

type UserResponseData struct {
	Id        int    `json:"Id"`
	IsAuth    bool   `json:"IsAuth"`
	Firstname string `json:"Firstname"`
	Lastname  string `json:"Lastname"`
}

type Users struct {
	Contacted []User `json:"Connected"`
	Online    []User `json:"Online"`
	Offline   []User `json:"Offline"`
}

type PaginationData struct {
	LastPage    int `json:"LastPage"`
	CurrentPage int `json:"CurrentPage"`
}

type AppData struct {
	UserData          UserData       `json:"UserData"`
	Users             Users          `json:"Users"`
	CurrentCategoryId int            `json:"CurrentCategoryId"`
	Categories        []Category     `json:"Categories"`
	PaginationData    PaginationData `json:"PaginationData"`
	Posts             []Post         `json:"Posts"`
}

func GetResponse() (AppData, error) {
	return AppData{}, nil
}
