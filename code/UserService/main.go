package main

import (
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris"
)
import "./controllers"

func main() {
	app := iris.Default()
	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	app.Use(crs)
	app.AllowMethods(iris.MethodOptions)
	app.Get("/queryuser", controllers.QueryUser)
	app.Post("/updateuser", controllers.UpdateUser)
	app.Post("/register", controllers.InsertUser)
	app.Post("/login", controllers.UserLogin)
	app.Get("/jaccount", controllers.JaccountLogin)
	app.Get("/getuserinfo", controllers.GetUserInfo)
	_ = app.Run(iris.Addr(":8080"))
}
