package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/web"
	"jing/app/api-gateway/controller/activity"
	loginController "jing/app/api-gateway/controller/login"
	userController "jing/app/api-gateway/controller/user"
	"jing/app/api-gateway/filter"
	"log"
)



func main() {
	service := web.NewService(
		web.Name("go.micro.api.api"),
		web.Address(":8080"),
		)

	service.Init()

	router := setupRouter()

	service.Handle("/", router)

	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(filter.AuthFilter)

	// login service
	lc := new(loginController.Controller)
	// user service
	uc := new(userController.Controller)
	// activity service
	ac := new(activity.Controller)

	publicRouter := router.Group("/api/public")
	{
		publicRouter.GET("/status", lc.GetUserStatus)
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.OAuthLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/detail/:id", uc.QueryUser)
		publicRouter.POST("/login/wx", lc.GetWXCode)
		publicRouter.GET("/wx/redirect", lc.BindJaccountAndWX)
		publicRouter.GET("/act/query", ac.QueryActivity)
		//publicRouter.GET("/act/findall", ac.QueryActivity)
		//publicRouter.GET("/activity", )
	}
	/*
		adminRouter := router.Group("/api/admin")
		{
			adminRouter.GET("/users")
			adminRouter.GET("/activities")
		}
	*/
	userRouter := router.Group("/api/user")
	{
		// TODO: Privilege & Request activity
		userRouter.POST("/act/publish", ac.PublishActivity)
		userRouter.POST("/act/modify", ac.ModifyActivity)
		userRouter.POST("/act/join", ac.JoinActivity)
		userRouter.POST("/act/delete", ac.DeleteActivity)
		userRouter.PUT("/info/update", uc.UpdateUser)
	}

	return router
}