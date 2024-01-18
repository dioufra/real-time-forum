package helper

import (
	"html/template"
	"net/http"
	"strconv"
)

func ErrorPage(w http.ResponseWriter, i int) error {
	DataError := struct {
		Code    string
		Message string
	}{
		Code:    strconv.Itoa(i),
		Message: http.StatusText(i),
	}
	page, err := template.ParseFiles("views/error/Errorpage.html")
	if err != nil {
		return err
	}
	w.WriteHeader(i)
	return page.Execute(w, DataError)
}
