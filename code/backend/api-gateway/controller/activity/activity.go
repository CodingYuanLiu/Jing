package activity

import (
	"github.com/gin-gonic/gin"
	activityClient "jing/app/api-gateway/cli/activity"
	"jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"jing/app/user/dao"
	"log"
	"net/http"
	"strconv"
)

type Controller struct{}

type Activity struct {
	Type string 		`json:"type" binding:"required"`
	CreateTime string	`json:"create_time" binding:"required"`
	EndTime string		`json:"end_time" binding:"required"`
	Title string		`json:"title" binding:"required"`
	Description string	`json:"description" binding:"required"`
	Tag []string		`json:"tag" binding:"required"`
	Store string		`json:"store" binding:"optional"`
	OrderTime string	`json:"order_time" binding:"optional"`
	DepartTime string	`json:"depart_time" binding:"optional"`
	Origin string		`json:"origin" binding:"optional"`
	Destination string	`json:"destination" binding:"optional"`
	ActivityTime string `json:"activity_time" binding:"optional"`
}

type ModifyActivity struct {
	ActId int			`json:"act_id" binding:"required"`
	Type string 		`json:"type" binding:"required"`
	CreateTime string	`json:"create_time" binding:"required"`
	EndTime string		`json:"end_time" binding:"required"`
	Description string	`json:"description" binding:"required"`
	Tag []string		`json:"tag" binding:"required"`
	Store string		`json:"store" binding:"optional"`
	OrderTime string	`json:"order_time" binding:"optional"`
	DepartTime string	`json:"depart_time" binding:"optional"`
	Origin string		`json:"origin" binding:"optional"`
	Destination string	`json:"destination" binding:"optional"`
	ActivityTime string `json:"activity_time" binding:"optional"`
}

// TODO: confirm whether user is admin
func (activityController *Controller) PublishActivity(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	act := Activity{}
	err := c.ShouldBindJSON(&act)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	err = activityClient.PublishActivity(int(resp.UserId), act)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't publish such activity",
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": "Publish successfully",
	})
}

func (activityController *Controller) JoinActivity(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	act := Activity{}
	err := c.ShouldBindJSON(&act)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	actId, _ := strconv.Atoi(c.Query("act_id"))
	_ = dao.JoinActivity(int(resp.UserId), actId)
	c.JSON(http.StatusOK, map[string]string{
		"message": "Join activity successfully",
	})
}

func (activityController *Controller) ModifyActivity(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	act := ModifyActivity{}
	err := c.ShouldBindJSON(&act)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	err = activityClient.ModifyActivity(int(resp.UserId), act)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't modify such activity",
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": "Modify successfully",
	})
}

func (activityController Controller) DeleteActivity(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	act := ModifyActivity{}
	err := c.ShouldBindJSON(&act)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	actId, _ := strconv.Atoi(c.Query("act_id"))
	err = activityClient.DeleteActivity(int(resp.UserId), actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't delete such activity",
		})
		c.Abort()
		return
	}
}

func (activityController Controller) QueryActivity(c *gin.Context) {
	actId, _ := strconv.Atoi(c.Query("act_id"))
	resp, err := activityClient.QueryActivity(actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't find that act",
		})
		c.Abort()
		return
	}
	returnJson := map[string]interface{}{
		"act_id": actId,
		"type": resp.BasicInfo.Type,
		"description": resp.BasicInfo.Description,
		"title": resp.BasicInfo.Title,
		"tag": resp.BasicInfo.Tag,
		"create_time": resp.BasicInfo.CreateTime,
		"end_time": resp.BasicInfo.EndTime,
	}
	if resp.BasicInfo.Type == "taxi" {
		returnJson["depart_time"] = resp.TaxiInfo.DepartTime
		returnJson["origin"] = resp.TaxiInfo.Origin
		returnJson["destination"] = resp.TaxiInfo.Destination
	} else if resp.BasicInfo.Type == "takeout" {
		returnJson["store"] = resp.TakeoutInfo.Store
		returnJson["order_time"] = resp.TakeoutInfo.OrderTime
	} else if resp.BasicInfo.Type == "order" {
		returnJson["store"] = resp.OrderInfo.Store
	} else if resp.BasicInfo.Type == "other" {
		returnJson["activity_time"] = resp.OtherInfo.ActivityTime
	}
	c.JSON(http.StatusOK, returnJson)
}