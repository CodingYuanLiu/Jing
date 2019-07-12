package activity

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	activityProto "jing/app/activity/proto"
	activityClient "jing/app/api-gateway/cli/activity"
	"jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	myjson "jing/app/json"
	"jing/app/user/dao"
	"log"
	"net/http"
	"strconv"
)

type Controller struct{}

// TODO: confirm whether user is admin

func generateJSON(actId int, userId int, userName string, userSignature string, resp *activityProto.QryResp) (returnJson myjson.JSON) {
	returnJson = map[string]interface{}{
		"sponsor_id": userId,
		"sponsor_username": userName,
		"signature": userSignature,
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
	return
}

func (activityController *Controller) FindAllActivity(c *gin.Context) {
	acts := dao.GetAllActId()
	var actJSONs []myjson.JSON
	for _, v := range acts {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) MyAct(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	var actJSONs []myjson.JSON
	acts := dao.GetJoinedActivity(int(resp.UserId))
	for _, v := range acts {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) ManageAct(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	var actJSONs []myjson.JSON
	acts := dao.GetManagingActivity(int(resp.UserId))
	for _, v := range acts {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

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
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Json parse error",
		})
		c.Abort()
		return
	}
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil ||
		jsonForm["title"] == nil || jsonForm["description"] == nil || jsonForm["tag"] == nil) ||
		jsonForm["type"].(string) == "taxi" && (jsonForm["depart_time"] == nil || jsonForm["origin"] == nil || jsonForm["destination"] == nil) ||
		jsonForm["type"].(string) == "takeout" && (jsonForm["order_time"] == nil || jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "order" && (jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "other" && (jsonForm["activity_time"] == nil)
	if check {
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
	err = activityClient.PublishActivity(int(resp.UserId), jsonForm)
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
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
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
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Json parse error",
		})
		c.Abort()
		return
	}
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil ||
		jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["act_id"] == nil) ||
		jsonForm["type"].(string) == "taxi" && (jsonForm["depart_time"] == nil || jsonForm["origin"] == nil || jsonForm["destination"] == nil) ||
		jsonForm["type"].(string) == "takeout" && (jsonForm["order_time"] == nil || jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "order" && (jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "other" && (jsonForm["activity_time"] == nil)
	if check {
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
	err = activityClient.ModifyActivity(int(resp.UserId), jsonForm)
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
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	actId, _ := strconv.Atoi(c.Query("act_id"))
	err := activityClient.DeleteActivity(int(resp.UserId), actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't delete such activity",
		})
		c.Abort()
		return
	}
}

func getActivityJson(actId int) (returnJson myjson.JSON, err error) {
	resp, err := activityClient.QueryActivity(actId)
	userId := dao.GetActivityAdmin(actId)
	user, _ := dao.FindUserById(userId)
	returnJson = generateJSON(actId, userId, user.Nickname, user.Signature, resp)
	return
}

func (activityController Controller) QueryActivity(c *gin.Context) {
	actId, _ := strconv.Atoi(c.Query("act_id"))
	returnJson , err := getActivityJson(actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't find that act",
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, returnJson)
}