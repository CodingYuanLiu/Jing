package activity

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	activityProto "jing/app/activity/proto"
	activityClient "jing/app/api-gateway/cli/activity"
	userClient "jing/app/api-gateway/cli/user"
	"jing/app/dao"
	myjson "jing/app/json"
	"log"
	"net/http"
	"sort"
	"strconv"
)

type Controller struct{}

func generateJSON(actId int, userId int, userName string, userSignature string, userAvatar string,resp *activityProto.QryResp) (returnJson myjson.JSON) {
	avatarUrl := "http://puo7ltwok.bkt.clouddn.com" + "/" + userAvatar
	returnJson = myjson.JSON{
		"sponsor_id": userId,
		"sponsor_username": userName,
		"sponsor_avatar":avatarUrl,
		"signature": userSignature,
		"act_id": actId ,
		"type": resp.BasicInfo.Type,
		"description": resp.BasicInfo.Description,
		"title": resp.BasicInfo.Title,
		"tag": resp.BasicInfo.Tag,
		"images":resp.BasicInfo.Images,
		"create_time": resp.BasicInfo.CreateTime,
		"end_time": resp.BasicInfo.EndTime,
		"status": resp.BasicInfo.Status,
		"max_member":resp.BasicInfo.MaxMember,
	}
	if resp.BasicInfo.Type == "taxi" {
		returnJson["depart_time"] = resp.TaxiInfo.DepartTime
		var ori, dest map[string]interface{}
		_ = bson.Unmarshal(resp.TaxiInfo.Origin, &ori)
		_ = bson.Unmarshal(resp.TaxiInfo.Destination, &dest)
		returnJson["origin"] = ori
		returnJson["destination"] = dest
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
		user, _ := dao.FindUserById(int(v.UserId))
		comment := myjson.JSON{
			"user_id": v.UserId,
			"receiver_id": v.ReceiverId,
			"content": v.Content,
			"time": v.Time,
			"user_nickname": user.Nickname,
		}
		if v.ReceiverId != -1 {
			receiver, _ := dao.FindUserById(int(v.ReceiverId))
			comment["receiver_nickname"] = receiver.Nickname
		}
		returnJson["comments"] = append(returnJson["comments"].([]myjson.JSON), comment)
	}
	return
}

func (activityController *Controller) GetGroupChatInfo(c *gin.Context) {
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
	}
	members, err := dao.GetActivityMembers(actId)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "Can't find act",
		})
		c.Abort()
		return
	}
	var jsons []map[string]interface{}
	for _, member := range members {
		resp, err := userClient.CallQueryUser(int32(member), -1)
		if err != nil {
			c.JSON(http.StatusBadRequest, map[string]string {
				"message": "Unexpected Error",
			})
			c.Abort()
			return
		}
		jsons = append(jsons, map[string]interface{} {
			"id": resp.Id,
			"username": resp.Username,
			"nickname": resp.Nickname,
			"avatar_url": resp.AvatarUrl,
		})
	}
	c.JSON(http.StatusOK, jsons)
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
	/* tag cannot be nil but images can.*/
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil ||
		jsonForm["title"] == nil || jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["images"] == nil) || (jsonForm["max_member"] == nil) ||
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

	err = activityClient.PublishActivity(int(userId), jsonForm)
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

	var act map[string] interface{}
	_ = dao.Collection.Find(bson.M{"actid":actId}).One(&act)
	basicInfo := act["basicinfo"].(map [string]interface{})
	status := dao.GetOverdueStatus(basicInfo["endtime"].(string),int32(basicInfo["status"].(int)))
	if status == 1{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message": "The member of the activity is already full",
		})
		c.Abort()
		return
	} else if status == 2{
		c.JSON(http.StatusBadRequest,map[string] string{
			"message": "The activity has expired",
		})
		c.Abort()
		return
	}

	_ = dao.JoinActivity(userId, actId)
	c.JSON(http.StatusOK, map[string]string{
		"message": "Join activity successfully",
	})
}

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

	var act map[string] interface{}
	_ = dao.Collection.Find(bson.M{"actid":actId}).One(&act)
	basicInfo := act["basicinfo"].(map [string]interface{})
	status := dao.GetOverdueStatus(basicInfo["endtime"].(string),int32(basicInfo["status"].(int)))
	if status == 1{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message": "The member of the activity is full already",
		})
		c.Abort()
		return
	} else if status == 2{
		c.JSON(http.StatusBadRequest,map[string] string{
			"message": "The activity has expired",
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
	_ = dao.Collection.Update(bson.M{"actid":actId},
	bson.M{"$set":bson.M{"basicinfo.status":dao.GetMaxMemberStatus(int32(actId),int32(basicInfo["maxmember"].(int)))}})

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
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil ||
		jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["act_id"] == nil) || (jsonForm["images"] == nil) ||
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
	acts := dao.GetManagingActivity(userId)
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
	err = activityClient.ModifyActivity(userId, jsonForm)
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
	if err != nil {
		return
	}
	userId := dao.GetActivityAdmin(actId)
	user, _ := dao.FindUserById(userId)
	returnJson = generateJSON(actId, userId, user.Nickname, user.Signature,user.AvatarKey, resp)
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
	num := activityClient.AddTags(tags, int32(userId))
	c.JSON(http.StatusOK,map[string]int32{
		"num":num,
	})
}

func (activityController *Controller) FindActivityByType(c *gin.Context){
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	actType := c.Query("type")
	if actType == ""{
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss type param",
		})
		c.Abort()
		return
	}

	var actJSONs []myjson.JSON

	acts,err := dao.GetActsByType(actType)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	retActs, status := getPages(index, size, acts)
	if status == -1 {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Can't get such pages. Check whether your index and activity is correct.",
		})
		c.Abort()
		return
	}
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) AddBehavior(c *gin.Context){
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
	if jsonForm["behavior"] == nil || jsonForm["type"] == nil{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message":"Miss some field",
		})
		c.Abort()
		return
	}
	behavior := jsonForm["behavior"].(string)
	type_ := jsonForm["type"].(string)
	check := (behavior != "search" && behavior != "scanning" && behavior != "join" && behavior != "publish") ||
		(type_ != "taxi" && type_ != "takeout" && type_ != "other" && type_ != "order")
	if check{
		c.JSON(http.StatusBadRequest,map[string]string{
			"message":"Wrong behavior or wrong type",
		})
		c.Abort()
		return
	}
	err = dao.AddBehavior(behavior,userId,type_)
	if err!=nil{
		c.JSON(http.StatusInternalServerError,map[string] string{
			"message":error.Error(err),
		})
		c.Abort()
		return
	} 	else{
		c.JSON(http.StatusOK,map[string] string{
			"message":"Add behavior succeed",
		})
	}
}

func (activityController *Controller) RecommendActivity(c *gin.Context){
	userId := c.GetInt("userId")
	var actJSONs []myjson.JSON
	recommendActs := activityClient.GetRecommendation(int32(userId))

	for _, v := range recommendActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}
