package activity

import (
	"context"
	"github.com/micro/go-micro/client"
	"gopkg.in/mgo.v2/bson"

	"github.com/micro/go-micro/client/grpc"
	"github.com/micro/go-plugins/registry/kubernetes"
	activityProto "jing/app/activity/proto"
	"jing/app/dao"
	"jing/app/json"
	"log"
	"os"
)

var (
	Client activityProto.ActivitySrvService
)

func init()  {

	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)
	Client = activityProto.NewActivitySrvService("act", client.DefaultClient)
}

func AddComment(actId int, userId int, receiverId int, content string, time string) (*activityProto.CmtResp,error) {
	req := activityProto.CmtReq{
		ActId: int32(actId),
		UserId: int32(userId),
		ReceiverId: int32(receiverId),
		Content: content,
		Time: time,
	}
	resp, err := Client.Comment(context.TODO(), &req)
	if err != nil {
		return nil,err
	}
	return resp,nil
}

func QueryActivity(actId int) (*activityProto.QryResp, error) {
	qryReq := activityProto.QryReq{
		ActId: int32(actId),
	}
	resp, err := Client.Query(context.TODO(), &qryReq)
	if err != nil {
		return nil, err
	}
	return resp, err
}

func DeleteActivity(actId int) (*activityProto.DltResp,error) {
	dltReq := activityProto.DltReq{
		ActId: int32(actId),
	}
	resp, err := Client.Delete(context.TODO(), &dltReq)
	if err != nil{
		return nil,err
	}

	return resp,nil
}

func ModifyActivity(userId int, jsonForm json.JSON) (*activityProto.MdfResp,error) {
	actType := jsonForm["type"].(string)
	var tags []string
	var images []string
	for _, v := range jsonForm["tag"].([]interface{}) {
		tags = append(tags, v.(string))
	}
	for _,v := range jsonForm["images"].([]interface{}){
		images = append(images,v.(string))
	}
	mdfReq := activityProto.MdfReq{
		ActId:       int32(jsonForm["act_id"].(float64)),
		CreateTime:  jsonForm["create_time"].(string),
		EndTime:     jsonForm["end_time"].(string),
		Description: jsonForm["description"].(string),
		Tag:         tags,
		Images:		 images,
		MaxMember:	 int32(jsonForm["max_member"].(float64)),
	}
	if actType == "takeout" {
		mdfReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: 		jsonForm["store"].(string),
			OrderTime: 	jsonForm["order_time"].(string),
		}
	} else if actType == "taxi" {
		origin, _ := bson.Marshal(jsonForm["origin"])
		dest, _ := bson.Marshal(jsonForm["destination"])
		mdfReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: 	jsonForm["depart_time"].(string),
			Origin: 		origin,
			Destination: 	dest,
		}
	} else if actType == "order" {
		mdfReq.OrderInfo = &activityProto.OrderInfo{
			Store: 			jsonForm["store"].(string),
		}
	} else if actType == "other" {
		mdfReq.OtherInfo = &activityProto.OtherInfo{
			ActivityTime: 	jsonForm["activity_time"].(string),
		}
	}
	resp2, err := Client.Modify(context.TODO(), &mdfReq)
	if err != nil {
		return nil,err
	}
	return resp2,nil
}

func PublishActivity(userId int, jsonForm json.JSON) (*activityProto.PubResp,error) {
	actType := jsonForm["type"].(string)
	var tags []string
	var images []string
	for _, v := range jsonForm["tag"].([]interface{}) {
		tags = append(tags, v.(string))
	}
	for _,image := range jsonForm["images"].([]interface {}){
		images = append(images,image.(string))
	}

	pubReq := activityProto.PubReq{
		Info: &activityProto.BasicInfo{
			Type:        actType,
			CreateTime:  jsonForm["create_time"].(string),
			EndTime:     jsonForm["end_time"].(string),
			Title:       jsonForm["title"].(string),
			Description: jsonForm["description"].(string),
			Tag:         tags,
			Images:		 images,
			MaxMember:	 int32(jsonForm["max_member"].(float64)),
		},
	}
	if actType == "takeout" {
		pubReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: 		jsonForm["store"].(string),
			OrderTime: 	jsonForm["order_time"].(string),
		}
	} else if actType == "taxi" {
		origin, _ := bson.Marshal(jsonForm["origin"])
		dest, _ := bson.Marshal(jsonForm["destination"])
		pubReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: 	jsonForm["depart_time"].(string),
			Origin: 		origin,
			Destination: 	dest,
		}
	} else if actType == "order" {
		pubReq.OrderInfo = &activityProto.OrderInfo{
			Store: 			jsonForm["store"].(string),
		}
	} else if actType == "other" {
		pubReq.OtherInfo = &activityProto.OtherInfo{
			ActivityTime: 	jsonForm["activity_time"].(string),
		}
	}
	resp2, err := Client.Publish(context.TODO(), &pubReq)
	if err != nil {
		return nil,err
	}
	_ = dao.PublishActivity(userId, int(resp2.ActId))
	return resp2,nil
}

func GenerateTags(title string,desc string) (*activityProto.TagResp,error){
	resp,err := Client.GenTags(context.TODO(),&activityProto.TagReq{
		Title:title,
		Description:desc,
	})
	if err!=nil{
		log.Println(err)
		return nil,err
	}
	return resp,nil
}

func AddTags(tags []string, userId int32) int32{
	resp,_ := Client.AddTags(context.TODO(),&activityProto.AddTagsReq{
		Tags:tags,
		UserId:userId,
	})
	return resp.Num
}

func GetRecommendation(userId int32) []int{
	resp,err := Client.Recommendation(context.TODO(),&activityProto.RecommendReq{
		UserId:userId,
	})
	acts := make([]int,0)

	if err != nil{
		log.Println(err)
		return acts
	}

	for _,int32Act := range resp.ActId{
		acts = append(acts,int(int32Act))
	}
	return acts
}