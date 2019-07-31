package feedback

import (
	"context"
	"github.com/micro/go-micro/client"
	"github.com/micro/go-micro/client/grpc"
	"github.com/micro/go-plugins/registry/kubernetes"
	feedbackProto "jing/app/feedback/proto"
	"jing/app/json"
	"os"
)

var (
	Client feedbackProto.FeedbackSrvService
)

func init() {
	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)
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