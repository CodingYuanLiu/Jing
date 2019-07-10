package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/web"
	loginController "jing/app/api-gateway/controller/login"
	userController "jing/app/api-gateway/controller/user"
	k8s "github.com/micro/kubernetes/go/micro"
	"jing/app/api-gateway/filter"
	"log"
)



func main() {
	service := k8s.NewService(
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
	// user service
	uc := new(userController.UserController)

	publicRouter := router.Group("/api/public")
	{
		publicRouter.GET("/status", lc.GetUserStatus)
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.OAuthLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/detail/:id", uc.QueryUser)
		publicRouter.POST("/login/wx", lc.GetWXCode)
		publicRouter.GET("/wx/redirect", lc.BindJaccountAndWX)
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