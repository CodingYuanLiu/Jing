package activity

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	activityProto "jing/app/activity/proto"
	activityClient "jing/app/api-gateway/cli/activity"
	userClient "jing/app/api-gateway/cli/user"
	"jing/app/dao"
	"jing/app/jing"
	myjson "jing/app/json"
	"log"
	"net/http"
	"sort"
	"strconv"
)

type Controller struct{}

func generateJSON(actId int, userId int, userName string, userSignature string, userAvatar string,resp *activityProto.QryResp) (returnJson myjson.JSON) {
	avatarUrl := "http://image.jing855.cn/" + userAvatar
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
			"user_avatar":"http://image.jing855.cn/" + user.AvatarKey,
		}
		if v.ReceiverId != -1 {
			receiver, _ := dao.FindUserById(int(v.ReceiverId))
			comment["receiver_nickname"] = receiver.Nickname
		}
		returnJson["comments"] = append(returnJson["comments"].([]myjson.JSON), comment)
	}
	return
}

func (activityController *Controller) AdminDeleteActivity(c *gin.Context) {
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
	}
	resp,err := activityClient.DeleteActivity(actId)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	_ = dao.DeleteActivity(actId)
	c.JSON(http.StatusOK, map[string]string {
		"message": resp.Description,
	})
}

func (activityController *Controller) FindActByUser(c *gin.Context) {
	userId, err := strconv.Atoi(c.Query("id"))
	if err != nil || userId == 0 {
		jing.SendError(c, jing.NewError(201, 400, "param 'id' not provided or bad"))
		return
	}
	var actJSONs []myjson.JSON
	acts := dao.GetManagingActivity(userId)
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
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
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
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
		jing.SendError(c,jing.NewError(203,400,"json parse error"))
		return
	}
	if jsonForm["receiver_id"] == nil || jsonForm["content"] == nil || jsonForm["act_id"] == nil || jsonForm["time"] == nil {
		jing.SendError(c,jing.NewError(203,400,"Miss some field"))
		return
	}
	resp,err := activityClient.AddComment(int(jsonForm["act_id"].(float64)), userId, int(jsonForm["receiver_id"].(float64)),
		jsonForm["content"].(string), jsonForm["time"].(string))
	if err != nil {
		jing.SendError(c, err)
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"message": resp.Description,
	})
}

// 0: correct,  1: not complete,  -1: error / can't get such pages
func getPages(index int, size int, acts []int) (retActs []int, status int, maxElements int, maxPages int) {
	sort.Sort(sort.Reverse(sort.IntSlice(acts)))
	maxElements = len(acts)
	if size == 0 {
		retActs = acts
		return
	}
	if size*index >= len(acts) {
		status = -1
		return
	}
	maxPages = len(acts) / size + 1
	for i := size*index; i < (index+1) * size; i++ {
		if i == len(acts) {
			status = 1
			return
		}
		retActs = append(retActs, acts[i])
		status = 1
	}
	return
}

func (activityController *Controller) FindAvailableActivity(c *gin.Context) {
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	var results []map[string]interface{}
	_ = dao.Collection.Find(bson.M{"basicinfo.status":int32(0)}).All(&results)
	if results == nil {
		c.JSON(http.StatusOK, results)
		return
	}
	var acts []int
	for _, result := range results {
		acts = append(acts, result["actid"].(int))
	}
	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	var actJSONs []myjson.JSON
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
}


func (activityController *Controller) FindAllActivity(c *gin.Context) {
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	acts := dao.GetAllActId()
	var actJSONs []myjson.JSON
	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
}

func (activityController *Controller) MyAct(c *gin.Context) {
	userId := c.GetInt("userId")
	var actJSONs []myjson.JSON
	acts := dao.GetJoinedActivity(userId)
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
}

func (activityController *Controller) ManageAct(c *gin.Context) {
	userId := c.GetInt("userId")
	var actJSONs []myjson.JSON
	acts := dao.GetManagingActivity(userId)
	index, _ := strconv.Atoi(c.Query("index"))
	size, _ := strconv.Atoi(c.Query("size"))
	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
}

func (activityController *Controller) PublishActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err != nil {
		log.Println(err)
		jing.SendError(c,jing.NewError(203,400,"json parse error"))
		return
	}
	/* tag cannot be nil but images can.*/
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil || (jsonForm["max_member"] == nil) ||
		jsonForm["title"] == nil || jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["images"] == nil) ||
		jsonForm["type"].(string) == "taxi" && (jsonForm["depart_time"] == nil || jsonForm["origin"] == nil || jsonForm["destination"] == nil) ||
		jsonForm["type"].(string) == "takeout" && (jsonForm["order_time"] == nil || jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "order" && (jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "other" && (jsonForm["activity_time"] == nil)
	if check {
		jing.SendError(c,jing.NewError(202,400,"Miss some field"))
		return
	}

	if int(jsonForm["max_member"].(float64))<1 {
		jing.SendError(c,jing.NewError(201,400,"Max member of the activity must be greater than 1"))
	}

	resp,err := activityClient.PublishActivity(int(userId), jsonForm)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"message": resp.Description,
		"act_id": resp.ActId,
	})
}

func (activityController *Controller) JoinActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
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
	} else if status == -1 {
		jing.SendError(c,jing.NewError(1,400,"The activity is blocked"))
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
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
	}
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
	} else if status == -1 {
		jing.SendError(c,jing.NewError(1,400,"The activity is blocked"))
		return
	}

	acceptId, _ := strconv.Atoi(c.Query("user_id"))
	err = dao.AcceptJoinActivity(acceptId, actId)
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
	applications,err := dao.GetJoinApplication(userId)
	if err != nil {
		jing.SendError(c,err)
		return
	}

	var appJSONs []myjson.JSON

	for _, v := range applications{
		actId := v["act_id"]
		applicantId := v["user_id"]

		applicant,err := dao.FindUserById(applicantId)
		if err != nil{
			jing.SendError(c,jing.NewError(300,400,"Query applicant infomation error"))
			return
		}

		resp, err := activityClient.QueryActivity(actId)
		if err != nil {
			jing.SendError(c,jing.NewError(300,400,"Find applied activity error"))
			return
		}
		appJSONs = append(appJSONs,myjson.JSON{
			"applicant_id":applicantId,
			"applicant_nickname":applicant.Nickname,
			"applicant_avatar":"http://image.jing855.cn/" + applicant.AvatarKey,
			"act_id":actId,
			"act_title":resp.BasicInfo.Title,
			"type":resp.BasicInfo.Type,
		})
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
		jing.SendError(c,jing.NewError(203,400,"Json parse error"))
		return
	}
	check := (jsonForm["type"] == nil || jsonForm["create_time"] == nil || jsonForm["end_time"] == nil || jsonForm["max_member"] == nil ||
		jsonForm["description"] == nil || jsonForm["tag"] == nil || jsonForm["act_id"] == nil) || (jsonForm["images"] == nil) ||
		jsonForm["type"].(string) == "taxi" && (jsonForm["depart_time"] == nil || jsonForm["origin"] == nil || jsonForm["destination"] == nil) ||
		jsonForm["type"].(string) == "takeout" && (jsonForm["order_time"] == nil || jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "order" && (jsonForm["store"] == nil) ||
		jsonForm["type"].(string) == "other" && (jsonForm["activity_time"] == nil)
	if check {
		jing.SendError(c,jing.NewError(203,400,"Miss some field"))
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
		jing.SendError(c,jing.NewError(105,403,"not the admin of the activity"))
		return
	}
	resp,err := activityClient.ModifyActivity(userId, jsonForm)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"message": resp.Description,
	})
}

func (activityController Controller) DeleteActivity(c *gin.Context) {
	userId := c.GetInt("userId")
	acts := dao.GetManagingActivity(userId)
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
	}
	flag := false
	for _, v := range acts {
		if actId == v {
			flag = true
			break
		}
	}
	if !flag {
		jing.SendError(c,jing.NewError(105,403,"not the admin of the activity"))
		return
	}
	resp,err := activityClient.DeleteActivity(actId)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	_ = dao.DeleteActivity(actId)
	c.JSON(http.StatusOK, map[string]string {
		"message": resp.Description,
	})
}

func getActivityJson(actId int) (returnJson myjson.JSON, err error) {
	resp, err := activityClient.QueryActivity(actId)
	if err != nil {
		log.Printf("Find activity %d error,%s\n",actId,err.Error())
		return nil, err
	}
	userId := dao.GetActivityAdmin(actId)
	user, _ := dao.FindUserById(userId)
	returnJson = generateJSON(actId, userId, user.Nickname, user.Signature,user.AvatarKey, resp)
	return
}

func (activityController *Controller) QueryActivity(c *gin.Context) {
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil || actId == 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "param 'act_id' not exists",
		})
		c.Abort()
		return
	}
	returnJson, err := getActivityJson(actId)
	if err != nil {
		jing.SendError(c, err)
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
		jing.SendError(c,jing.NewError(203,400,"Json parse error"))
		return
	}
	check := jsonForm["title"] == nil || jsonForm["description"] == nil
	if check{
		jing.SendError(c,jing.NewError(203,400,"Miss some field"))
		return
	}
	resp,err := activityClient.GenerateTags(jsonForm["title"].(string),jsonForm["description"].(string))
	if err != nil{
		jing.SendError(c,err)
		return
	}
	c.JSON(http.StatusOK,map[string][]string{
		"tags":resp.Tag,
	})
}

func (activityController *Controller) AddTags(c *gin.Context) {
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err != nil {
		log.Println(err)
		jing.SendError(c,jing.NewError(203,400,"json parse error"))
		return
	}
	if jsonForm["tags"] == nil{
		jing.SendError(c,jing.NewError(203,400,"Miss some field"))
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

	retActs, status, maxEle, maxPages := getPages(index, size, acts)
	object := myjson.JSON{}
	if status == -1 {
		jing.SendError(c,jing.NewError(203,400,fmt.Sprintf("Can not get page. There are %d elements totally.", maxEle)))
		return
	} else if status == 1 {
		object["max_pages"] = maxPages
	}
	object["total_elements"] = maxEle
	for _, v := range retActs {
		resp, _ := getActivityJson(v)
		actJSONs = append(actJSONs, resp)
	}
	object["acts"] = actJSONs
	c.JSON(http.StatusOK, object)
}

func (activityController *Controller) AddBehavior(c *gin.Context){
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err != nil {
		log.Println(err)
		jing.SendError(c,jing.NewError(203,400,"json parse error"))
		return
	}
	if jsonForm["behavior"] == nil || jsonForm["type"] == nil{
		jing.SendError(c,jing.NewError(203,400,"Miss some field"))
		return
	}
	behavior := jsonForm["behavior"].(string)
	type_ := jsonForm["type"].(string)
	check := (behavior != "search" && behavior != "scanning" && behavior != "join" && behavior != "publish") ||
		(type_ != "taxi" && type_ != "takeout" && type_ != "other" && type_ != "order")
	if check{
		jing.SendError(c,jing.NewError(201,400,"Wrong behavior or wrong type"))
		return
	}
	err = dao.AddBehavior(behavior,userId,type_)
	if err!=nil{
		jing.SendError(c,err)
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
	resp,err := activityClient.GetRecommendation(int32(userId))
	if err != nil{
		jing.SendError(c,err)
		return
	}
	for _, v := range resp.ActId {
		resp, _ := getActivityJson(int(v))
		actJSONs = append(actJSONs, resp)
	}
	c.JSON(http.StatusOK, actJSONs)
}

func (activityController *Controller) BlockActivity(c *gin.Context){
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'act_id' is not provided or bad"))
		return
	}

	err = dao.Collection.Update(bson.M{"actid":actId},
		bson.M{"$set":bson.M{"basicinfo.status":int32(-1)}})
	if err != nil{
		jing.SendError(c,jing.NewError(300,400,"can not block the activity"))
		return
	}

	dao.CancelApplicationOfBlockedActivity(actId)

	c.JSON(http.StatusOK,map[string] string{
		"message":"block activity successfully",
	})
}

func (activityController *Controller) UnblockActivity(c *gin.Context){
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'act_id' is not provided or bad"))
		return
	}

	var act map[string] interface{}
	err = dao.Collection.Find(bson.M{"actid":actId}).One(&act)
	if err != nil{
		jing.SendError(c,jing.NewError(301,404,"can not find the activity"))
		return
	}
	basicInfo := act["basicinfo"].(map[string] interface{})
	status := dao.GetOverdueStatus(basicInfo["endtime"].(string),
		dao.GetMaxMemberStatus(int32(actId),int32(basicInfo["maxmember"].(int))))

	err = dao.Collection.Update(bson.M{"actid":actId},
		bson.M{"$set":bson.M{"basicinfo.status":status}})
	if err != nil{
		jing.SendError(c,jing.NewError(300,400,"can not block the activity"))
		return
	}
	c.JSON(http.StatusOK,map[string] string{
		"message":"unblock activity successfully",
	})
}

func (activityController *Controller) GetActivityMembers(c *gin.Context){
	actId, err := strconv.Atoi(c.Query("act_id"))
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'act_id' is not provided or bad"))
		return
	}
	members,err := dao.GetActivityMembers(actId)
	if err != nil{
		jing.SendError(c,err)
		return
	}
	var returnJSON []myjson.JSON
	for _,member := range members{
		user,err := dao.FindUserById(member)
		if err!=nil{
			jing.SendError(c,jing.NewError(301,404,"can not find a member in mysql"))
			return
		}
		returnJSON = append(returnJSON,myjson.JSON{
			"user_id":user.ID,
			"user_avatar":"http://image.jing855.cn/" + user.AvatarKey,
			"user_nickname":user.Nickname,
			"user_signature":user.Signature,
		})
	}
	c.JSON(http.StatusOK,returnJSON)
}

func (activityController *Controller) GetUnacceptedApplication(c *gin.Context){
	userId := c.GetInt("userId")
	log.Printf("Get unaccepted application of user %d\n",userId)
	actIds,err := dao.GetUnacceptedApplication(userId)
	if err != nil{
		jing.SendError(c,err)
		return
	}
	var returnJSONs []myjson.JSON
	for _,actId := range actIds{
		resp, err := activityClient.QueryActivity(actId)
		if err != nil {
			jing.SendError(c,jing.NewError(300,400,"Find applied activity error"))
			return
		}
		returnJSONs = append(returnJSONs,myjson.JSON{
			"act_id":actId,
			"act_title":resp.BasicInfo.Title,
			"type":resp.BasicInfo.Type,
			"description":resp.BasicInfo.Description,
		})
	}
	c.JSON(http.StatusOK,returnJSONs)
}