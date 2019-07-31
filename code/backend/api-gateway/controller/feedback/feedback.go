package feedback

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	feedbackClient "jing/app/api-gateway/cli/feedback"
	"jing/app/dao"
	feedbackProto "jing/app/feedback/proto"
	"jing/app/jing"
	myjson "jing/app/json"
	"log"
	"net/http"
	"strconv"
)

type Controller struct{}

func generateJSON(feedback *feedbackProto.Feedback) (myjson.JSON,error){
	user,err := dao.FindUserById(int(feedback.UserId))
	if err != nil{
		return myjson.JSON{},err
	}
	act,err := dao.GetActivity(feedback.ActId)
	returnJSON := myjson.JSON{
		"user_id":user.ID,
		"user_avatar":"http://image.jing855.cn/" + user.AvatarKey,
		"user_nickname":user.Nickname,
		"act_id":feedback.ActId,
		"communication":feedback.Communication,
		"communication_desc":feedback.CommunicationDesc,
		"punctuality":feedback.Punctuality,
		"punctuality_desc": feedback.PunctualityDesc,
		"honesty": feedback.Honesty,
		"honesty_desc" :feedback.HonestyDesc,
		"feedback_id":feedback.Id,
		"fb_images" : feedback.FbImages,
		"time": feedback.Time,
	}
	if err != nil{
		log.Println("The activity of the feedback can not be found")
	} else{
		basicInfo := act["basicinfo"].(map[string]interface{})
		returnJSON["act_title"] = basicInfo["title"].(string)
	}

	returnJSON["fb_comments"] = []myjson.JSON{}
	for _,comment := range feedback.FbComment{
		commentator,err2 := dao.FindUserById(int(comment.CommentatorId))
		if err2 != nil{
			return myjson.JSON{},err
		}
		fbComment := myjson.JSON{
			"time":comment.Time,
			"commentator_id":comment.CommentatorId,
			"commentator_nickname":commentator.Nickname,
			"commentator_avatar":"http://image.jing855.cn/" + commentator.AvatarKey,
			"comment_desc":comment.CommentDesc,
		}
		returnJSON["fb_comments"] = append(returnJSON["fb_comments"].([]myjson.JSON),fbComment)
	}
	return returnJSON,nil
}

func isInMembers(user int,members []int) bool{
	isIn := false
	for _,member := range members{
		if user == member{
			isIn = true
			return isIn
		}
	}
	return false
}

func (feedbackController *Controller) PublishFeedback(c *gin.Context){
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		jing.SendError(c,jing.NewError(201,400,"JSON parse error"))
		return
	}

	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	check := jsonForm["act_id"] == nil 		|| jsonForm["receiver_id"]==nil ||
			 jsonForm["communication"]==nil || jsonForm["communication_desc"] == nil ||
			 jsonForm["punctuality"] == nil || jsonForm["punctuality_desc"] == nil ||
			 jsonForm["honesty"] == nil 	|| jsonForm["honesty_desc"] == nil ||
		     jsonForm["fb_images"] == nil	|| jsonForm["time"] == nil
	if check {
		jing.SendError(c,jing.NewError(202,400,"Miss some field"))
		return
	}

	var receiverId = int(jsonForm["receiver_id"].(float64))
	if !dao.HasUser(receiverId){
		jing.SendError(c,jing.NewError(201,400,"The receiver does not exist"))
		return
	}

	memberIds,err := dao.GetActivityMembers(int(jsonForm["act_id"].(float64)))
	if err != nil{
		jing.SendError(c,jing.NewError(201,400,"Activity does not exist in mysql"))
		return
	}
	if !isInMembers(userId,memberIds){
		jing.SendError(c,jing.NewError(105,403,"The user has no authority to make that feedback"))
		return
	}
	if !isInMembers(receiverId,memberIds){
		jing.SendError(c,jing.NewError(201,400,"The receiver is not the member of the activity"))
		return
	}

	check = int32(jsonForm["communication"].(float64)) > 5 || 	int32(jsonForm["communication"].(float64)) <1 	||
			int32(jsonForm["punctuality"].(float64)) > 5  	|| 	int32(jsonForm["punctuality"].(float64)) < 1 	||
			int32(jsonForm["honesty"].(float64)) > 5 		|| 	int32(jsonForm["honesty"].(float64)) < 1
	if check {
		jing.SendError(c,jing.NewError(201,400,"invalid starring parameter"))
		return
	}

	resp,err := feedbackClient.PublishFeedback(int32(userId),jsonForm)
	if err != nil{
		jing.SendError(c,err)
		return
	}
	c.JSON(http.StatusOK,map[string] string{
		"feedback_id": resp.ObjectId,
		"message" : resp.Description,
	})
	return
}

func (feedbackController *Controller) QueryFeedback(c *gin.Context){
	receiverId, err := strconv.Atoi(c.Query("receiver_id"))
	if err != nil || receiverId == 0 {
		jing.SendError(c,jing.NewError(201,400,"Receiver_id is bad or don't exist"))
		return
	}
	if !dao.HasUser(receiverId){
		jing.SendError(c,jing.NewError(201,400,"Receiver does not exist"))
		return
	}
	resp,err := feedbackClient.QueryFeedback(int32(receiverId))
	if err != nil{
		jing.SendError(c,err)
		return
	}

	var returnJSON []myjson.JSON
	for _,feedback := range resp.Feedbacks{
		returnFeedback,err2 := generateJSON(feedback)
		if err2 != nil{
			log.Println(err2)
			continue
		}
		returnJSON = append(returnJSON,returnFeedback)
	}
	c.JSON(http.StatusOK,returnJSON)
}

func (feedbackController *Controller) DeleteFeedback(c *gin.Context){
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		jing.SendError(c,jing.NewError(201,400,"JSON parse error"))
		return
	}

	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if jsonForm["object_id"] == nil {
		jing.SendError(c,jing.NewError(202,400,"Miss some field"))
		return
	}
	objectId := jsonForm["object_id"].(string)
	if !bson.IsObjectIdHex(objectId) {
		jing.SendError(c,jing.NewError(201,400,"Invalid objectId"))
		return
	}
	resp,err := feedbackClient.DeleteFeedback(int32(userId),objectId)
	if err != nil{
		jing.SendError(c,err)
		return
	}
	c.JSON(http.StatusOK,resp)
}

func (feedbackController *Controller) CommentFeedback(c *gin.Context) {
	userId := c.GetInt("userId")
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		jing.SendError(c,jing.NewError(201,400,"JSON parse error"))
		return
	}

	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	check := jsonForm["object_id"] == nil || jsonForm["commentator_desc"] == nil || jsonForm["time"] == nil
	if check {
		jing.SendError(c,jing.NewError(202,400,"Miss some field"))
		return
	}
	objectId := jsonForm["object_id"].(string)
	if !bson.IsObjectIdHex(objectId) {
		jing.SendError(c,jing.NewError(201,400,"Invalid objectId"))
		return
	}
	resp,err := feedbackClient.CommentFeedback(int32(userId),objectId,
		jsonForm["commentator_desc"].(string),jsonForm["time"].(string))
	if err != nil{
		jing.SendError(c,err)
		return
	}
	c.JSON(http.StatusOK,resp)
}