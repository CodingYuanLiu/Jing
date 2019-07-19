package activity

import (
	"context"
	"errors"
	"fmt"
	"github.com/micro/go-micro/client"
	activityProto "jing/app/activity/proto"
	"jing/app/dao"
	"jing/app/json"
	"log"
)

var (
	Client activityProto.ActivitySrvService
)

func init()  {
	/*
	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)
	 */
	Client = activityProto.NewActivitySrvService("act", client.DefaultClient)
}

func AddComment(actId int, userId int, receiverId int, content string, time string) error {
	req := activityProto.CmtReq{
		ActId: int32(actId),
		UserId: int32(userId),
		ReceiverId: int32(receiverId),
		Content: content,
		Time: time,
	}
	resp, _ := Client.Comment(context.TODO(), &req)
	if resp.Status != 200 {
		return errors.New(fmt.Sprintf("error, status %d, msg: %s", resp.Status, resp.Description))
	}
	return nil
}

func QueryActivity(actId int) (*activityProto.QryResp, error) {
	qryReq := activityProto.QryReq{
		ActId: int32(actId),
	}
	resp, _ := Client.Query(context.TODO(), &qryReq)
	if resp.Status != 200 {
		return nil, errors.New(fmt.Sprintf("error, status %d", resp.Status))
	}
	return resp, nil
}

func DeleteActivity(userId int, actId int) error {
	dltReq := activityProto.DltReq{
		ActId: int32(actId),
	}
	resp, _ := Client.Delete(context.TODO(), &dltReq)
	if resp.Status != 200 {
		return errors.New(fmt.Sprintf("error, status %d, msg: %s", resp.Status, resp.Description))
	}
	return nil
}

func ModifyActivity(userId int, jsonForm json.JSON) error {
	actType := jsonForm["type"].(string)
	var tags []string
	for _, v := range jsonForm["tag"].([]interface{}) {
		tags = append(tags, v.(string))
	}
	mdfReq := activityProto.MdfReq{
		ActId:       int32(jsonForm["act_id"].(float64)),
		CreateTime:  jsonForm["create_time"].(string),
		EndTime:     jsonForm["end_time"].(string),
		Description: jsonForm["description"].(string),
		Tag:         tags,
	}
	if actType == "takeout" {
		mdfReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: 		jsonForm["store"].(string),
			OrderTime: 	jsonForm["order_time"].(string),
		}
	} else if actType == "taxi" {
		mdfReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: 	jsonForm["depart_time"].(string),
			Origin: 		jsonForm["origin"].(string),
			Destination: 	jsonForm["destination"].(string),
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
		return err
	}
	if resp2.Status != 200 {
		return errors.New(fmt.Sprintf("error, status %d, msg: %s", resp2.Status, resp2.Description))
	}
	return nil
}

func PublishActivity(userId int, jsonForm json.JSON) error {
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
		},
	}
	if actType == "takeout" {
		pubReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: 		jsonForm["store"].(string),
			OrderTime: 	jsonForm["order_time"].(string),
		}
	} else if actType == "taxi" {
		pubReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: 	jsonForm["depart_time"].(string),
			Origin: 		jsonForm["origin"].(string),
			Destination: 	jsonForm["destination"].(string),
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
		return err
	}
	if resp2.Status != 200 {
		return errors.New(fmt.Sprintf("error, status %d, msg: %s", resp2.Status, resp2.Description))
	}
	_ = dao.PublishActivity(userId, int(resp2.ActId))
	return nil
}

func GenerateTags(title string,desc string) []string{
	resp,err := Client.GenTags(context.TODO(),&activityProto.TagReq{
		Title:title,
		Description:desc,
	})
	if err!=nil{
		log.Println(err)
	}
	return resp.Tag
}

func AddTags(tags []string, userId int32) int32{
	resp,_ := Client.AddTags(context.TODO(),&activityProto.AddTagsReq{
		Tags:tags,
		UserId:userId,
	})
	return resp.Num
}