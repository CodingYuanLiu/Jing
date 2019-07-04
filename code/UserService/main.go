package main

import "github.com/kataras/iris"
import "./controllers"

func main() {
	app := iris.Default()
	app.Get("/queryuser", controllers.QueryUser)
	app.Post("/updateuser", controllers.UpdateUser)
	app.Post("/insertuser", controllers.InsertUser)
	app.Post("/login", controllers.Login)
	app.Get("/print", controllers.Print)
	app.Get("/jaccount", controllers.JaccountLogin)
	app.Get("/getuserinfo", controllers.GetUserInfo)
	_ = app.Run(iris.Addr(":30251"))
}
