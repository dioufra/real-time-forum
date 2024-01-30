package helper

import (
	"database/sql"
	"fmt"
	"net/http"
	"real-time-forum/server/models"
	"strconv"
	"strings"
	"time"

	"github.com/gofrs/uuid/v5"
	"golang.org/x/crypto/bcrypt"
)

type Data struct {
	All    interface{}
	IsAuth bool
	// Categories models.CatPost
	// Pagination models.Metadata
	User models.User
}

var u1 = uuid.Must(uuid.NewV4())

func UpdateSession(db *sql.DB, sssid, useremail string) error {
	req := `SELECT sessionId,email,datefin from Session Where email='` + useremail + `';`
	// req:=fmt.Sprintf(`SELECT * from Session Where email=?;`)
	row, err := db.Query(req)
	var sessionid, email string
	var datef time.Time
	var errsession error
	if err != nil {
		fmt.Println(err)
		return err
	}

	for row.Next() {
		row.Scan(&sessionid, &email, &datef)

	}

	if email == useremail {
		_, errsession = db.Exec("UPDATE Session SET sessionId=?, datefin=? where sessionId=? AND email=?;", sssid, time.Now().Add(time.Hour*24*3), sssid, email)
	} else {
		_, errsession = db.Exec("INSERT INTO Session (sessionId,email,datefin) VALUES(?,?,?);", sssid, useremail, time.Now().Add(time.Hour*24*3))
	}
	return errsession

}

func ValidateCredential(userLogin models.UserLogin) (bool, models.User, error) {
	var user models.User
	if err := models.UserRepo.GetUser(&user, userLogin.Login); err != nil {
		return false, user, err
	}
	return IsPasswordsMatch(user.Password, userLogin.Password), user, nil
}

func Auth(Db *sql.DB, r *http.Request) (bool, string) {
	sessionpi, err := r.Cookie("sessionid")
	if err != nil || sessionpi.String() == "" {
		return false, ""
	}
	var Id int
	var sessionId, email string
	var datef time.Time
	req := `SELECT * from Session Where sessionId=?;`
	row, err := Db.Query(req, sessionpi.Value)

	if err != nil {
		return false, ""
	}
	for row.Next() {
		row.Scan(&Id, &sessionId, &email, &datef)
	}

	if sessionId != "" && email != "" && datef.After(time.Now()) {
		return true, email
	}
	return false, ""
}

func Getmethod(r *http.Request, method string) bool {
	return strings.ToLower(r.Method) == method
	// if strings.ToLower(r.Method) != method {
	// 	return false
	// }
	// return true
}

func CheckRequest(r *http.Request, path, method string) (bool, int) {
	if strings.ToLower(r.Method) == method && r.URL.Path == path {
		return true, 0
	} else if !Getmethod(r, method) {
		return false, 405
	} else {
		return false, 404
	}
}
func DeleteSessio(db *sql.DB, ssid string) error {
	req := `DELETE from Session Where sessionId=?;`
	_, err := db.Exec(req, ssid)
	return err
}

// ******************************* PARSE FILE IN URL *****************
func PArseUlr(r *http.Request, match string) (bool, int) {
	index := strings.Split(r.URL.Path[1:], "/")
	if len(index) == 2 && index[0] == match {
		id, err := strconv.Atoi(index[1])
		if err == nil {
			return true, id
		}
	}
	return false, 0
}

func FecthError(ch []error) bool {
	for _, err := range ch {
		if err != nil {
			fmt.Println(err)
			return true
		}
	}
	return false
}

func ParseCatId(cat []string) ([]int, error) {
	catid := []int{}
	for _, v := range cat {
		a, errt := strconv.Atoi(v)
		if errt != nil {
			return []int{}, errt
		}
		catid = append(catid, a)
	}
	return catid, nil
}

func SetCookie(res http.ResponseWriter) string {
	sessionId := u1.String() + "-" + time.Now().GoString()
	cookie := http.Cookie{
		Name:     "sessionid",
		Value:    sessionId,
		Expires:  time.Now().Add(time.Hour * 24 * 3),
		Path:     "/",
		MaxAge:   3600 * 24 * 3,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(res, &cookie)
	return sessionId
}

func HashPassword(pwd string) (string, error) {
	var pwdBytes = []byte(pwd)
	hashedPwd, err := bcrypt.GenerateFromPassword(pwdBytes, bcrypt.MinCost)
	return string(hashedPwd), err
}

func IsPasswordsMatch(hashedPwd, currentPwd string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPwd), []byte(currentPwd))
	return err == nil
}

func SessionAddOrUpdate(db *sql.DB, sssid, useremail string) error {
	req := `SELECT sessionId,email,datefin from Session Where email='` + useremail + `';`
	row, err := db.Query(req)
	var sessionid, email string
	var datef time.Time
	var errsession error
	if err != nil {
		fmt.Println(err)
		return err
	}

	for row.Next() {
		row.Scan(&sessionid, &email, &datef)

	}

	if email == useremail {
		fmt.Println("sssid", sssid)
		_, errsession = db.Exec("UPDATE Session SET sessionId=?, datefin=? where email=?;", sssid, time.Now().Add(time.Hour*24*3), email)
	} else {
		_, errsession = db.Exec("INSERT INTO Session (sessionId,email,datefin) VALUES(?,?,?);", sssid, useremail, time.Now().Add(time.Hour*24*3))
	}
	return errsession

}

// func GetData(r *http.Request, db *sql.DB, f func(*sql.DB, models.Pagination, string) ([]models.AllPost, error), pagination models.Pagination, w http.ResponseWriter, isAuth bool, metadata models.Metadata, user models.User) (Data, error) {
// 	var category models.Category
// 	// CatPost:=models.CatPost{}
// 	Cat, errcookie := r.Cookie("cat")
// 	Cats := ""
// 	if errcookie == nil {
// 		Cats = Cat.Value
// 	}
// 	data, errs := f(db, pagination, Cats)
// 	if errs != nil {
// 		return Data{}, errs
// 	}

// 	categories, errc := category.GetCategory(db)
// 	if errc != nil {
// 		return Data{}, errc
// 	}
// 	Data := Data{All: data, IsAuth: isAuth, Categories: categories, Pagination: metadata, User: user}
// 	return Data, nil
// }

// func SetPagination(db *sql.DB, r *http.Request, user models.User, query string) (models.Pagination, models.Metadata, error) {
// 	pageParam := r.URL.Query().Get("page")
// 	if pageParam == "" {
// 		pageParam = "1"
// 	}
// 	var err error
// 	models.ActualPage, err = strconv.Atoi(pageParam)
// 	if err != nil || models.ActualPage <= 0 {
// 		models.ActualPage = 1
// 	}
// 	pagination := models.Pagination{
// 		PageSize: 6,
// 		Page:     models.ActualPage,
// 	}
// 	totalRecords, err := models.GetTotalRecords(query, user, db)
// 	if err != nil {
// 		return models.Pagination{}, models.Metadata{}, err
// 	}
// 	metadata := models.GetMetadata(totalRecords, pagination.Page, pagination.PageSize)
// 	if pagination.Page > metadata.LastPage {
// 		pagination.Page = metadata.LastPage
// 		metadata.CurrentPage = pagination.Page
// 	}
// 	return pagination, metadata, nil
// }

// func GetFilterCat(ListPost_id []int, posts []models.AllPost) []models.AllPost {
// 	FilterPosts := []models.AllPost{}
// 	if len(ListPost_id) > 0 {
// 		for _, v := range posts {
// 			fmt.Println(v.OnePost.ID)
// 			for _, y := range ListPost_id {
// 				if v.OnePost.ID == y {
// 					FilterPosts = append(FilterPosts, v)
// 					break
// 				}
// 			}
// 		}
// 		return FilterPosts
// 	}
// 	return posts
// }

// func List_posts_id(db *sql.DB, cat_id string) []int {
// 	caId, err := strconv.Atoi(cat_id)
// 	if err != nil {
// 		return []int{}
// 	}
// 	categorie := models.Category{}
// 	ListPost_id, errPost := categorie.Post_id(db, caId)
// 	if errPost != nil {
// 		return []int{}
// 	}
// 	return ListPost_id
// }
