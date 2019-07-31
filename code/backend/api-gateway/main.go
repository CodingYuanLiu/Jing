package main

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-web"
	k8s "github.com/micro/kubernetes/go/web"
	"jing/app/api-gateway/controller/activity"
	feedbackController "jing/app/api-gateway/controller/feedback"
	functionController "jing/app/api-gateway/controller/function"
	loginController "jing/app/api-gateway/controller/login"
	userController "jing/app/api-gateway/controller/user"
	"jing/app/api-gateway/filter"
	"log"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}

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

	// handle CORS
	router.Use(corsMiddleware())

	router.Use(filter.AuthFilter)

	// login service
	lc := new(loginController.Controller)
	// user service
	uc := new(userController.Controller)
	// activity service
	ac := new(activity.Controller)

	fc := new(functionController.Controller)

	fbc := new(feedbackController.Controller)

	publicRouter := router.Group("/api/public")
	{
		// TODO: Confirm register's security
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.JaccountLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/detail", uc.QueryUser)
		publicRouter.POST("/login/wx", lc.GetWXCode)
		publicRouter.GET("/wx/redirect", lc.BindJaccountAndWX)
		publicRouter.GET("/act/query", ac.QueryActivity)
		publicRouter.GET("/act/findall", ac.FindAllActivity)
		publicRouter.GET("/act/findbytype",ac.FindActivityByType)
		publicRouter.GET("/takeout/searchshop", fc.TakeoutSearchShop)
		publicRouter.GET("/chat/members", ac.GetGroupChatInfo)
		publicRouter.GET("/feedback/query",fbc.QueryFeedback)
		publicRouter.GET("/act/findbyuser", ac.FindActByUser)
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
		userRouter.GET("/status", lc.GetUserStatus)
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
		userRouter.POST("/act/gettag",ac.GetTags)
		userRouter.POST("/act/addtag",ac.AddTags)
		userRouter.POST("/act/addbehavior",ac.AddBehavior)
		userRouter.GET("/act/recommendact",ac.RecommendActivity)
		userRouter.GET("/followings", uc.GetFollowings)
		userRouter.GET("/followers", uc.GetFollowers)
		userRouter.GET("/friends", uc.GetFriends)
		userRouter.GET("/follow", uc.Follow)
		userRouter.GET("/changeprivacy", uc.ChangePrivacyLevel)

		// Feedback manipulation
		userRouter.POST("/feedback/publish", fbc.PublishFeedback)
		userRouter.POST("/feedback/delete",fbc.DeleteFeedback)
		userRouter.POST("feedback/comment",fbc.CommentFeedback)
	}

	adminRouter := router.Group("/api/admin")
	{
		adminRouter.GET("/banuser", uc.BanUser)
		adminRouter.POST("/act/delete", ac.AdminDeleteActivity)
		adminRouter.GET("/findallusers", uc.FindAllUsers)
		adminRouter.GET("/queryuser", uc.AdminQueryUser)
	}

	return router
}