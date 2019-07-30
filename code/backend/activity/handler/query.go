package handler

import (
	"context"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) Query(ctx context.Context,req *activity.QryReq,resp *activity.QryResp) error {
	//fmt.Println(req)
	result,err := dao.GetActivity(req.ActId)
	if err != nil{
		return err
	}
	//Use map to fetch the result.
	mapBasicInfo := result["basicinfo"].(map[string] interface{})
	basicInfo := activity.BasicInfo{
		Type:        mapBasicInfo["type"].(string),
		Description: mapBasicInfo["description"].(string),
		Title:       mapBasicInfo["title"].(string),
		CreateTime : mapBasicInfo["createtime"].(string),
		EndTime :    mapBasicInfo["endtime"].(string),
		MaxMember:   int32(mapBasicInfo["maxmember"].(int)),
		Status:      dao.GetOverdueStatus(mapBasicInfo["endtime"].(string),int32(mapBasicInfo["status"].(int))),
	}
	if basicInfo.Status == 2 && mapBasicInfo["status"].(int) != 2{
		err = dao.Collection.Update(bson.M{"actid":req.ActId},
		bson.M{"$set":bson.M{"basicinfo.status":int32(2)}})
		log.Println("Update overdue status")
		if err!=nil{
			log.Println("Update overdue status error")
			log.Println(err)
		}
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
		origin, _ := bson.Marshal(mapTaxiInfo["origin"])
		dest, _ := bson.Marshal(mapTaxiInfo["destination"])
		taxiInfo := activity.TaxiInfo{
			DepartTime:  mapTaxiInfo["departtime"].(string),
			Origin:      origin,
			Destination: dest,
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
