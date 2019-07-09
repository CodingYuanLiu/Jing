package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/web"
	loginController "jing/app/api-gateway/controller/login"
	userController "jing/app/api-gateway/controller/user"
	authSrv "jing/app/api-gateway/service/auth-service"
	userSrv "jing/app/api-gateway/service/user-service"
	filter "jing/app/api-gateway/filter"
	"log"
)



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

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(filter.AuthFilter)

	// login service
	lc := new(loginController.LoginController)
	lc.AuthSrv = new(authSrv.AuthService)
	// user service
	uc := new(userController.UserController)
	uc.UserSrv = new(userSrv.UserService)

	publicRouter := router.Group("/api/public")
	{
		publicRouter.POST("/status", lc.GetUserStatus)
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.OAuthLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/:id/detail", uc.QueryUser)
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
		userRouter.PUT("/info/update", uc.UpdateUser)
	}

	return router
}