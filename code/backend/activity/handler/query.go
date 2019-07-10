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
	err := actSrv.Collection.Find(bson.M{"actid": req.Actid}).One(&result)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}else if err != nil{
		log.Fatal(err)
	}
	//Use map to fetch the result.
	mapBasicinfo := result["basicinfo"].(map[string] interface{})
	basicinfo := activity.BasicInfo{
		Type:        mapBasicinfo["type"].(string),
		Description: mapBasicinfo["description"].(string),
		Title:       mapBasicinfo["title"].(string),
		CreateTime : mapBasicinfo["createtime"].(string),
		EndTime :    mapBasicinfo["endtime"].(string),
	}
	for _,param := range mapBasicinfo["tag"].([]interface{}){
		basicinfo.Tag = append(basicinfo.Tag,param.(string))
	}
	resp.Basicinfo = &basicinfo
	switch basicinfo.Type {
	case "Taxi":
		mapTaxiinfo := result["taxiinfo"].(map[string] interface{})
		taxiinfo := activity.TaxiInfo{
			DepartTime:  mapTaxiinfo["departtime"].(string),
			Origin:      mapTaxiinfo["origin"].(string),
			Destination: mapTaxiinfo["destination"].(string),
		}
		resp.Taxiinfo = &taxiinfo
	case "Takeout":
		mapTakeoutinfo :=result["takeoutinfo"].(map[string] interface{})
		takeoutinfo:= activity.TakeoutInfo{
			Store:     mapTakeoutinfo["store"].(string),
			Ordertime: mapTakeoutinfo["ordertime"].(string),
		}
		resp.Takeoutinfo = &takeoutinfo
	default :
		fmt.Println("Undefined Type.")
	}
	return nil
}
