package handler

import (
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

func (actSrv *ActivitySrv) Query(ctx context.Context,req *activity.QryReq,resp *activity.QryResp) error {
	//fmt.Println(req)
	var result map[string] interface{}
	err := actSrv.Collection.Find(bson.M{"actid": req.ActId}).One(&result)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
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
	resp.BasicInfo = &basicInfo
	switch basicInfo.Type {
	case "taxi":
		mapTaxiInfo := result["taxiinfo"].(map[string] interface{})
		taxiInfo := activity.TaxiInfo{
			DepartTime:  mapTaxiInfo["departtime"].(string),
			Origin:      mapTaxiInfo["origin"].(string),
			Destination: mapTaxiInfo["destination"].(string),
		}
		resp.TaxiInfo = &taxiInfo
	case "takeout":
		mapTakeoutInfo :=result["takeoutinfo"].(map[string] interface{})
		takeoutInfo := activity.TakeoutInfo{
			Store:     mapTakeoutInfo["store"].(string),
			OrderTime: mapTakeoutInfo["ordertime"].(string),
		}
		resp.TakeoutInfo = &takeoutInfo
	case "order":
		mapOrderInfo := result["orderinfo"].(map[string] interface{})
		orderInfo := activity.OrderInfo{
			Store: mapOrderInfo["store"].(string),
		}
		resp.OrderInfo = &orderInfo
	case "other":
		mapOtherInfo := result["otherinfo"].(map[string] interface{})
		otherInfo := activity.OtherInfo{
			ActivityTime:mapOtherInfo["activitytime"].(string),
		}
		resp.OtherInfo = &otherInfo
	default :
		fmt.Println("Undefined Type.")
	}
	return nil
}
