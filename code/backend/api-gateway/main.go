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
		publicActRouter := router.Group("api/public/act")
		{
			publicActRouter.GET("/findbyuser", ac.FindActByUser)
			publicActRouter.GET("/getactivitymember",ac.GetActivityMembers)
			publicActRouter.GET("/search", ac.SearchAct)
			publicActRouter.GET("/quitratio",ac.GetUserQuitRatio)
			publicActRouter.GET("/query", ac.QueryActivity)
			publicActRouter.GET("/findall", ac.FindAllActivity)
			publicActRouter.GET("/findbytype",ac.FindActivityByType)
		}
		publicRouter.POST("/register", uc.Register)
		publicRouter.POST("/login/jaccount", lc.JaccountLogin)
		publicRouter.POST("/login/native", lc.NativeLogin)
		publicRouter.GET("/detail", uc.QueryUser)
		publicRouter.POST("/login/wx", lc.GetWXCode)
		publicRouter.GET("/wx/redirect", lc.BindJaccountAndWX)
		publicRouter.GET("/takeout/searchshop", fc.TakeoutSearchShop)
		publicRouter.GET("/chat/members", ac.GetGroupChatInfo)
		publicRouter.GET("/feedback/query",fbc.QueryFeedback)
	}

	userRouter := router.Group("/api/user")
	{
		userActRouter := router.Group("/api/user/act")
		{
			userActRouter.GET("/myact", ac.MyAct)
			userActRouter.GET("/manageact", ac.ManageAct)
			userActRouter.POST("/publish", ac.PublishActivity)
			userActRouter.POST("/modify", ac.ModifyActivity)
			userActRouter.POST("/join", ac.JoinActivity)
			userActRouter.POST("/quit",ac.QuitActivity)
			userActRouter.GET("/getjoinapp",ac.GetJoinApplication)
			userActRouter.POST("/acceptjoin",ac.AcceptJoinActivity)
			userActRouter.GET("/getunacceptedapp",ac.GetUnacceptedApplication)
			userActRouter.POST("/delete", ac.DeleteActivity)
			userActRouter.POST("/comment", ac.Comment)
			userActRouter.GET("/status", ac.Status)
			userActRouter.GET("/refused", ac.GetRefusedActivity)
			userActRouter.GET("/refuse", ac.RefuseJoinActivity)
			userActRouter.GET("/refuse/confirm", ac.ConfirmRefusedActivity)
			userActRouter.POST("/gettag",ac.GetTags)
			userActRouter.POST("/addtag",ac.AddTags)
			userActRouter.POST("/addbehavior",ac.AddBehavior)
			userActRouter.GET("/recommendact",ac.RecommendActivity)
		}
		userRouter.GET("/status", lc.GetUserStatus)
		userRouter.PUT("/info/update", uc.UpdateUser)
		userRouter.POST("/avatar/upload", uc.UploadAvatar)
		userRouter.GET("/followings", uc.GetFollowings)
		userRouter.GET("/followers", uc.GetFollowers)
		userRouter.GET("/friends", uc.GetFriends)
		userRouter.GET("/follow", uc.Follow)
		userRouter.GET("/unfollow", uc.UnFollow)

		// Feedback manipulation
		feedbackRouter := router.Group("/api/user/feedback")
		{
			feedbackRouter.POST("/publish", fbc.PublishFeedback)
			feedbackRouter.POST("/delete",fbc.DeleteFeedback)
			feedbackRouter.POST("/comment",fbc.CommentFeedback)
		}
	}

	adminRouter := router.Group("/api/admin")
	{
		adminActRouter := router.Group("/api/admin/act")
		{
			adminActRouter.GET("/findavailable", ac.FindAvailableActivity)
			adminActRouter.POST("/delete", ac.AdminDeleteActivity)
			adminActRouter.GET("/blockact",ac.BlockActivity)
			adminActRouter.GET("/unblockact",ac.UnblockActivity)
		}
		adminRouter.GET("/stat", fc.GetStatistics)
		adminRouter.GET("/banuser", uc.BanUser)
		adminRouter.GET("/findallusers", uc.FindAllUsers)
		adminRouter.GET("/queryuser", uc.AdminQueryUser)
		adminRouter.GET("/findonlineusers", uc.GetOnlineUsers)

	}
	return router
}