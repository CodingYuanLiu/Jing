package main

import "github.com/kataras/iris"
import "./controllers"

func main() {
	app := iris.Default()
	app.Get("/queryuser", controllers.QueryUser)
	app.Post("/updateuser", controllers.UpdateUser)
	app.Post("/insertuser", controllers.InsertUser)
	_ = app.Run(iris.Addr(":8080"))
}