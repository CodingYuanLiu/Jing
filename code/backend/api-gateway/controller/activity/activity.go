package activity

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	activityProto "jing/app/activity/proto"
	activityClient "jing/app/api-gateway/cli/activity"
	"jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"jing/app/dao"
	myjson "jing/app/json"
	"log"
	"net/http"
	"sort"
	"strconv"
)

type Controller struct{}

func generateJSON(actId int, userId int, userName string, userSignature string, resp *activityProto.QryResp) (returnJson myjson.JSON) {
	returnJson = myjson.JSON{
		"sponsor_id": userId,
		"sponsor_username": userName,
		"signature": userSignature,
		"act_id": actId ,
		"type": resp.BasicInfo.Type,
		"description": resp.BasicInfo.Description,
		"title": resp.BasicInfo.Title,
		"tag": resp.BasicInfo.Tag,
		"images":resp.BasicInfo.Images,
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
	returnJson["comments"] = []myjson.JSON{}
	comments := resp.Comments
	for _, v := range comments {
		var title string
		user, _ := dao.FindUserById(int(v.UserId))
		if v.ReceiverId != -1 {
			receiver, _ := dao.FindUserById(int(v.ReceiverId))
			title = fmt.Sprintf("%s -> %s", user.Nickname, receiver.Nickname)
		} else {
			title = fmt.Sprintf("%s", user.Nickname)
		}
		comment := myjson.JSON{
			"user_id": v.UserId,
			"receiver_id": v.ReceiverId,
			"content": v.Content,
			"time": v.Time,
			"title": title,
		}
		returnJson["comments"] = append(returnJson["comments"].([]myjson.JSON), comment)
	}
	return
}

func (activityController *Controller) Status(c *gin.Context) {
	userId := c.GetInt("userId")
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	}
	c.JSON(http.StatusOK, map[string]int {
		"status": dao.CheckStatus(userId, actId),
	})
}

func (activityController *Controller) Comment(c *gin.Context) {
	userId := c.GetInt("userId")
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
	if jsonForm["receiver_id"] == nil || jsonForm["content"] == nil || jsonForm["act_id"] == nil || jsonForm["time"] == nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	err = activityClient.AddComment(int(jsonForm["act_id"].(float64)), userId, int(jsonForm["receiver_id"].(float64)),
		jsonForm["content"].(string), jsonForm["time"].(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't comment",
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": "Comment successfully",
	})
}

// 0: correct,  1: not complete,  -1: error / can't get such pages
func getPages(index int, size int, acts []int) (retActs []int, status int) {
	sort.Sort(sort.Reverse(sort.IntSlice(acts)))
	if size == 0 {
		retActs = acts
		return
	}
	if size*index >= len(acts) {
		status = -1
		return
	}
	for i := size*index; i < (index+1) * size; i++ {
		if i == len(acts) {
			status = 1
			return
		}
		retActs = append(retActs, acts[i])
	}
	return
}

func (activityController *Controller) FindAllActivity(c *gin.Context) {
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	acts := dao.GetAllActId()
	var actJSONs []myjson.JSON
	retActs, status := getPages(index, size, acts)
	if status == -1 {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't get such pages. Check whether your index and activity is correct.",
		})
	}
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) MyAct(c *gin.Context) {
	userId := c.GetInt("userId")
	var actJSONs []myjson.JSON
	acts := dao.GetJoinedActivity(userId)
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	retActs, status := getPages(index, size, acts)
	if status == -1 {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't get such pages. Check whether your index and activity is correct.",
		})
	}
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) ManageAct(c *gin.Context) {
	userId := c.GetInt("userId")
	var actJSONs []myjson.JSON
	acts := dao.GetManagingActivity(userId)
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	retActs, status := getPages(index, size, acts)
	if status == -1 {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't get such pages. Check whether your index and activity is correct.",
		})
	}
	for _, v := range retActs {
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
	/* tag cannot be nil but images can.*/
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil ||
		jsonForm["title"] == nil || jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["images"] == nil) ||
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
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": "Publish successfully",
	})
}

func (activityController *Controller) JoinActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	actId, _ := strconv.Atoi(c.Query("act_id"))
	_ = dao.JoinActivity(userId, actId)
	c.JSON(http.StatusOK, map[string]string{
		"message": "Join activity successfully",
	})
}

//TODO:Finish it at 7.17 morning
func (activityController *Controller) AcceptJoinActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	acts := dao.GetManagingActivity(userId)
	actId, _ := strconv.Atoi(c.Query("act_id"))
	flag := false
	for _, v := range acts {
		if actId == v {
			flag = true
		}
	}
	if !flag {
		c.JSON(http.StatusForbidden, map[string]string {
			"message": "403 Forbidden",
		})
		c.Abort()
		return
	}
	acceptId, _ := strconv.Atoi(c.Query("user_id"))
	err := dao.AcceptJoinActivity(acceptId, actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "Accept join activity application error",
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK,map[string]string{
		"message":"Accept successfully",
	})
}

func (activityController *Controller) GetJoinApplication(c *gin.Context){
	userId := c.GetInt("userId")
	applications := dao.GetJoinApplication(userId)
	var appJSONs []myjson.JSON
	for _, v := range applications{
		application,_ := getActivityJson(v["act_id"])
		application["applicant_id"] = v["user_id"]
		appJSONs = append(appJSONs,application)
	}
	c.JSON(http.StatusOK,appJSONs)
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
	acts := dao.GetManagingActivity(int(resp.UserId))
	flag := false
	for _, v := range acts {
		if int(jsonForm["act_id"].(float64)) == v {
			flag = true
			break
		}
	}
	if !flag {
		c.JSON(http.StatusForbidden, map[string]string{
			"message": "403 Forbidden",
		})
		c.Abort()
		return
	}
	err = activityClient.ModifyActivity(int(resp.UserId), jsonForm)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": "Modify successfully",
	})
}

func (activityController Controller) DeleteActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	acts := dao.GetManagingActivity(userId)
	actId, _ := strconv.Atoi(c.Query("act_id"))
	flag := false
	for _, v := range acts {
		if actId == v {
			flag = true
			break
		}
	}
	if !flag {
		c.JSON(http.StatusForbidden, map[string]string{
			"message": "403 Forbidden",
		})
		c.Abort()
		return
	}
	err := activityClient.DeleteActivity(userId, actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
		c.Abort()
		return
	}
	_ = dao.DeleteActivity(actId)
	c.JSON(http.StatusOK, map[string]string {
		"message": "Delete successfully",
	})
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

func (activityController *Controller) GetTags(c *gin.Context) {
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
	check := jsonForm["title"] == nil || jsonForm["description"] == nil
	if check{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message":"Miss some field",
		})
		c.Abort()
		return
	}

	tags := activityClient.GenerateTags(jsonForm["title"].(string),jsonForm["description"].(string))
	c.JSON(http.StatusOK,map[string][]string{
		"tags":tags,
	})
}

func (activityController *Controller) AddTags(c *gin.Context) {
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
	if jsonForm["tags"] == nil{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message":"Miss some field",
		})
		c.Abort()
		return
	}
	/* transform []interface{} to []string*/
	var tags []string
	for _,param := range jsonForm["tags"].([]interface{}){
		tags = append(tags,param.(string))
	}
	num := activityClient.AddTags(tags,resp.UserId)
	c.JSON(http.StatusOK,map[string]int32{
		"num":num,
	})
}