package controllers

// func Response(res http.ResponseWriter, req *http.Request) {
// 	log.Println("hello form response")

// 	if req.Method != http.MethodGet {
// 		log.Println("❌ Bad method")
// 		return
// 	}

// 	ok, email := helper.Auth(DB, req)
// 	if !ok {
// 		log.Println("❌ not connected:", email )
// 		return
// 	}
// 	var user models.User

// 	err := models.UserRepo.GetUserByEmail(&user, email)
// 	if err != nil {
// 		log.Println("❌ Error retrieving user")
// 		return
// 	}

// 	res.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(res).Encode(map[string]any{"user": user}); err != nil {
// 		// If encoding fails, log the error (you might want to handle this differently)
// 		log.Println("Error encoding JSON response:", err)
// 	}
// }
