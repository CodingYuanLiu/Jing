package feedback

import (
	"context"
	"github.com/micro/go-micro/client"
	//"github.com/micro/go-micro/client/grpc"
	//"github.com/micro/go-plugins/registry/kubernetes"
	"gopkg.in/mgo.v2/bson"
	"jing/app/dao"
	feedbackProto "jing/app/feedback/proto"
	"jing/app/jing"
	"jing/app/json"
	//"os"
)

var (
	Client feedbackProto.FeedbackSrvService
)

func init() {
	/*os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)*/
	Client = feedbackProto.NewFeedbackSrvService("feedback", client.DefaultClient)
}

func PublishFeedback(userId int32,jsonForm json.JSON) (*feedbackProto.PubResp,error) {
	var images []string
	for _,image := range jsonForm["fb_images"].([]interface {}){
		images = append(images,image.(string))
	}
	pubReq := &feedbackProto.PubReq{
		UserId:				userId,
		ReceiverId: 		int32(jsonForm["receiver_id"].(float64)),
		ActId: 				int32(jsonForm["act_id"].(float64)),
		Communication: 		int32(jsonForm["communication"].(float64)),
		CommunicationDesc:  jsonForm["communication_desc"].(string),
		Punctuality:		int32(jsonForm["punctuality"].(float64)),
		PunctualityDesc:	jsonForm["punctuality_desc"].(string),
		Honesty:			int32(jsonForm["honesty"].(float64)),
		HonestyDesc:		jsonForm["honesty_desc"].(string),
		FbImages:			images,
		Time:				jsonForm["time"].(string),
	}
	resp,err := Client.Publish(context.TODO(),pubReq)
	if err != nil {
		return nil,err // The resp now is nil
	}
	return resp,nil
}

func QueryFeedback(receiverId int32) (*feedbackProto.QryResp,error){
	resp,err := Client.Query(context.TODO(),&feedbackProto.QryReq{
		ReceiverId:receiverId,
	})
	if err != nil{
		return nil,err
	}
	return resp,nil
}

func DeleteFeedback(userId int32, objectId string) (*feedbackProto.DltResp,error){
	resp,err := Client.Delete(context.TODO(),&feedbackProto.DltReq{
		UserId:userId,
		ObjectId: objectId,
	})
	if err != nil{
		return nil,err
	}else{
		return resp,nil
	}
}

func CommentFeedback(commentatorId int32, objectId string, commentDesc string, time string) (*feedbackProto.CmtResp,error){
	resp,err := Client.Comment(context.TODO(),&feedbackProto.CmtReq{
		CommentatorId: commentatorId,
		ObjectId: objectId,
		CommentDesc: commentDesc,
		Time: time,
	})
	if err != nil{
		return nil,err
	} else{
		return resp,nil
	}
}

func CheckValidFeedbackToAct(userId int,receiverId int,actId int) error{
	if !dao.HasUser(receiverId){
		return jing.NewError(201,400,"The receiver does not exist")
	}

	if receiverId == userId{
		return jing.NewError(201,400,"Can not feedback to yourself")
	}

	memberIds,err := dao.GetActivityMembers(actId)
	if err != nil{
		return jing.NewError(201,400,"Activity does not exist in mysql")
	}
	if !isInMembers(userId,memberIds){
		return jing.NewError(105,403,"The user has no authority to make that feedback")
	}
	if !isInMembers(receiverId,memberIds){
		return jing.NewError(201,400,"The receiver is not the member of the activity")
	}

	query := []bson.M{
		{"receiverid": int32(receiverId)},
		{"userid": int32(userId)},
		{"actid": int32(actId)},
	}
	count,err := dao.FeedbackCollection.Find(bson.M{"$and":query}).Count()
	if err != nil{
		return jing.NewError(300,400,"Can not find and check repetitive feedback in mongo")
	}
	if count > 0 {
		return jing.NewError(1,403,"You have already given the feedback")
	}

	return nil
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