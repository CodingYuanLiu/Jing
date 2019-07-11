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
	err := actSrv.Collection.Find(bson.M{"actid": req.Actid}).One(&result)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}else if err != nil{
		log.Fatal(err)
	}
	//Use map to fetch the result.
	mapBasicInfo := result["basicInfo"].(map[string] interface{})
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
	resp.Basicinfo = &basicInfo
	switch basicInfo.Type {
	case "Taxi":
		mapTaxiInfo := result["taxiInfo"].(map[string] interface{})
		taxiInfo := activity.TaxiInfo{
			DepartTime:  mapTaxiInfo["departtime"].(string),
			Origin:      mapTaxiInfo["origin"].(string),
			Destination: mapTaxiInfo["destination"].(string),
		}
		resp.Taxiinfo = &taxiInfo
	case "Takeout":
		mapTakeoutInfo :=result["takeoutinfo"].(map[string] interface{})
		takeoutInfo := activity.TakeoutInfo{
			Store:     mapTakeoutInfo["store"].(string),
			Ordertime: mapTakeoutInfo["ordertime"].(string),
		}
		resp.Takeoutinfo = &takeoutInfo
	default :
		fmt.Println("Undefined Type.")
	}
	return nil
}
