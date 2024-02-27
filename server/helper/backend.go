package helper

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/server/models"
	"regexp"
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

func GetChatParticipants(senderId, receiverId int) (models.User, models.User, error) {
	var sender, receiver models.User
	if err := models.UserRepo.GetUserById(&sender, senderId); err != nil {
		fmt.Println("❌ could not get sender: ", err)
		return sender, receiver, err
	}
	if err := models.UserRepo.GetUserById(&receiver, receiverId); err != nil {
		fmt.Println("❌ could not get receiver: ", err)
		return sender, receiver, err
	}
	return sender, receiver, nil
}

// func Getmethod(r *http.Request, method string) bool {
// 	return strings.ToLower(r.Method) == method
// 	// if strings.ToLower(r.Method) != method {
// 	// 	return false
// 	// }
// 	// return true
// }

//	func CheckRequest(r *http.Request, path, method string) (bool, int) {
//		if strings.ToLower(r.Method) == method && r.URL.Path == path {
//			return true, 0
//		} else if !Getmethod(r, method) {
//			return false, 405
//		} else {
//			return false, 404
//		}
//	}
// func DeleteSessio(db *sql.DB, ssid string) error {
// 	req := `DELETE from Session Where sessionId=?;`
// 	_, err := db.Exec(req, ssid)
// 	return err
// }

// // ******************************* PARSE FILE IN URL *****************
// func PArseUlr(r *http.Request, match string) (bool, int) {
// 	index := strings.Split(r.URL.Path[1:], "/")
// 	if len(index) == 2 && index[0] == match {
// 		id, err := strconv.Atoi(index[1])
// 		if err == nil {
// 			return true, id
// 		}
// 	}
// 	return false, 0
// }

// func FecthError(ch []error) bool {
// 	for _, err := range ch {
// 		if err != nil {
// 			fmt.Println(err)
// 			return true
// 		}
// 	}
// 	return false
// }

// func ParseCatId(cat []string) ([]int, error) {
// 	catid := []int{}
// 	for _, v := range cat {
// 		a, errt := strconv.Atoi(v)
// 		if errt != nil {
// 			return []int{}, errt
// 		}
// 		catid = append(catid, a)
// 	}
// 	return catid, nil
// }

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

func SendResponse(res http.ResponseWriter, data interface{}, code int) {
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(code)
	if err := json.NewEncoder(res).Encode(data); err != nil {
		fmt.Println("❌ Error encoding json response")
	}
}

func HandleError(res http.ResponseWriter, message string, code int) {
	response := map[string]string{"message": message}
	SendResponse(res, response, code)
}

func ValidateRegistrationInput(newUser models.User, w http.ResponseWriter) bool {
	fieldsTab := [][]string{
		{"firstname", `^(\S)....*$`, newUser.Firstname},
		{"lastname", "^[A-Za-z]+$", newUser.Lastname},
		{"age", "^[0-9]{1,2}$", newUser.Age},
		{"gender", "^(Male|Female)$", newUser.Gender},
		{"username", "^[a-z][a-z0-9]+$", newUser.Username},
		{"email", `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`, newUser.Email},
		{"password", "^....+$", newUser.Password},
	}

	for _, item := range fieldsTab {
		field, pattern, str := item[0], item[1], item[2]
		re, err := regexp.Compile(pattern)
		if err != nil {
			fmt.Println("❌ Error compiling regex:", err)
			return false
		}
		if !re.MatchString(str) {
			errorMessage := map[string]string{"message": "invalid " + field, "property": field}
			SendResponse(w, errorMessage, http.StatusBadRequest)
			return false
		}
	}

	if newUser.Password != newUser.RepeatPassword {
		SendResponse(w, map[string]string{"message": "passwords do not match"}, http.StatusBadRequest)
		return false
	}

	return true
}

func IsUniqueLogin(e_user, u_user models.User, w http.ResponseWriter) bool {
	if e_user.Id > 0 {
		fmt.Println("❌ this email is already taken")
		SendResponse(w, map[string]string{"message": "this email is already taken"}, http.StatusBadRequest)
		return false
	}

	if u_user.Id > 0 {
		fmt.Println("❌ this username is already taken")
		SendResponse(w, map[string]string{"message": "this username is already taken"}, http.StatusBadRequest)
		return false
	}
	return true
}
