package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/web"
	loginHandler "jing/app/api-gateway/handler/login"
	"log"
)


func setupRouter() *gin.Engine {
	router := gin.Default()

	lh := new(loginHandler.Login)
	publicRouter := router.Group("/api/public")
	{
		publicRouter.POST("/user/status", lh.AuthHandler)
		//publicRouter.POST("/user/register", )
		publicRouter.POST("/user/login/jaccount", lh.LoginByJaccountHandler)
		publicRouter.POST("/user/login/up", lh.LoginByUPHanler)
		//publicRouter.GET("/user/detail", )
		//publicRouter.GET("/activity", )
	}
	/*
		adminRouter := router.Group("/api/admin")
		{
			adminRouter.GET("/users")
			adminRouter.GET("/activities")
		}
		userRouter := router.Group("api/user")
		{
			userRouter.PUT("/info/update")

		}
	*/
	return router
}

func main() {
	service := web.NewService(
		web.Name("go.micro.api.api"),
		)

	service.Init()

	router := setupRouter()

	service.Handle("/", router)

	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}