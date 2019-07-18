package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-web"
	k8s "github.com/micro/kubernetes/go/web"
	"jing/app/api-gateway/controller/activity"
	loginController "jing/app/api-gateway/controller/login"
	userController "jing/app/api-gateway/controller/user"
	"jing/app/api-gateway/filter"
	"log"
)

func main() {
	service := k8s.NewService(
		web.Name("api"),
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
		// TODO: Confirm register's security
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.JaccountLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/detail", uc.QueryUser)
		publicRouter.POST("/login/wx", lc.GetWXCode)
		publicRouter.GET("/wx/redirect", lc.BindJaccountAndWX)
		publicRouter.GET("/act/query", ac.QueryActivity)
		publicRouter.GET("/act/findall", ac.FindAllActivity)
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
		userRouter.GET("/act/myact", ac.MyAct)
		userRouter.GET("/act/manageact", ac.ManageAct)
		userRouter.POST("/act/publish", ac.PublishActivity)
		userRouter.POST("/act/modify", ac.ModifyActivity)
		userRouter.POST("/act/join", ac.JoinActivity)
		userRouter.GET("/act/getjoinapp",ac.GetJoinApplication)
		userRouter.POST("/act/acceptjoin",ac.AcceptJoinActivity)
		userRouter.POST("/act/delete", ac.DeleteActivity)
		userRouter.POST("/act/comment", ac.Comment)
		userRouter.GET("/act/status", ac.Status)
		userRouter.PUT("/info/update", uc.UpdateUser)
		userRouter.POST("/avatar/upload", uc.UploadAvatar)
	}

	return router
}
