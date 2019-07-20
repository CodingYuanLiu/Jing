package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"log"
)

func (actSrv *ActivitySrv) Query(ctx context.Context,req *activity.QryReq,resp *activity.QryResp) error {
	//fmt.Println(req)
	var result map[string] interface{}
	err := actSrv.Collection.Find(bson.M{"actid": req.ActId}).One(&result)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		resp.Status = 404
		return err
	}else if err != nil{
		log.Fatal(err)
	}
	//Use map to fetch the result.
	mapBasicInfo := result["basicinfo"].(map[string] interface{})
	basicInfo := activity.BasicInfo{
		Type:        mapBasicInfo["type"].(string),
		Description: mapBasicInfo["description"].(string),
		Title:       mapBasicInfo["title"].(string),
		CreateTime : mapBasicInfo["createtime"].(string),
		EndTime :    mapBasicInfo["endtime"].(string),
	}
	for _,param := range mapBasicInfo["tag"].([]interface{}){
		basicInfo.Tag = append(basicInfo.Tag,param.(string))
	}
	for _,param := range mapBasicInfo["images"].([]interface{}){
		basicInfo.Images = append(basicInfo.Images,param.(string))
	}

	var comments []*activity.Comment
	for _,param := range result["comments"].([]interface{}){
		//Need a intermediate map tp transfer map to comment
		mapParam := param.(map[string] interface{})

		//Need a intermediate variable to transfer int to int32
		intUserId := mapParam["userid"].(int)
		intReceiverId := mapParam["receiverid"].(int)
		comment := activity.Comment{
			UserId:int32(intUserId),
			ReceiverId:int32(intReceiverId),
			Content:mapParam["content"].(string),
			Time:mapParam["time"].(string),
		}
		comments = append(comments,&comment)
	}
	resp.BasicInfo = &basicInfo
	resp.Comments = comments
	switch basicInfo.Type {
	case "taxi":
		mapTaxiInfo := result["taxiinfo"].(map[string] interface{})
		taxiInfo := activity.TaxiInfo{
			DepartTime:  mapTaxiInfo["departtime"].(string),
			Origin:      mapTaxiInfo["origin"].(string),
			Destination: mapTaxiInfo["destination"].(string),
		}
		resp.TaxiInfo = &taxiInfo
		resp.Status = 200
	case "takeout":
		mapTakeoutInfo :=result["takeoutinfo"].(map[string] interface{})
		takeoutInfo := activity.TakeoutInfo{
			Store:     mapTakeoutInfo["store"].(string),
			OrderTime: mapTakeoutInfo["ordertime"].(string),
		}
		resp.TakeoutInfo = &takeoutInfo
		resp.Status = 200
	case "order":
		mapOrderInfo := result["orderinfo"].(map[string] interface{})
		orderInfo := activity.OrderInfo{
			Store: mapOrderInfo["store"].(string),
		}
		resp.OrderInfo = &orderInfo
		resp.Status = 200

	case "other":
		mapOtherInfo := result["otherinfo"].(map[string] interface{})
		otherInfo := activity.OtherInfo{
			ActivityTime:mapOtherInfo["activitytime"].(string),

		}
		resp.OtherInfo = &otherInfo
		resp.Status = 200
	}
	//log.Println("Query successfully.")
	return nil
}
