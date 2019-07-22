package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act map[string]interface{}
	err := dao.Collection.Find(bson.M{"actid": req.ActId}).One(&act)
	if err == mgo.ErrNotFound{
		log.Println(err)
		resp.Status=404
		resp.Description="Not Found"
		return err
	}
	mapBasicInfo :=act["basicinfo"].(map[string]interface{})
	fetchType:= mapBasicInfo["type"].(string)

	basicInfo:=dao.BasicInfo{
		Type:        fetchType,
		Title:       mapBasicInfo["title"].(string),
		CreateTime:  req.CreateTime,
		EndTime:     req.EndTime,
		Description: req.Description,
		Tag:         req.Tag,
	}
	for _,param := range mapBasicInfo["images"].([]interface{}){
		basicInfo.Images = append(basicInfo.Images,param.(string))
	}
	switch fetchType{
	case "taxi":
		taxiInfo := dao.TaxiInfo{
			DepartTime:req.TaxiInfo.DepartTime,
			Origin:req.TaxiInfo.Origin,
			Destination:req.TaxiInfo.Destination,
		}
		err = dao.Collection.Update(
		bson.M{"actid":req.ActId},
		bson.M{"$set":bson.M{"basicinfo":basicInfo,"taxiinfo":taxiInfo}})
	case "takeout":
		takeoutInfo:=dao.TakeoutInfo{
			Store:req.TakeoutInfo.Store,
			OrderTime:req.TakeoutInfo.OrderTime,
		}
		err = dao.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"takeoutinfo":takeoutInfo}})
	case "order":
		orderInfo := dao.OrderInfo{
			Store:req.OrderInfo.Store,
		}
		err = dao.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"orderinfo":orderInfo}})
	case "other":
		otherInfo := dao.OtherInfo{
			ActivityTime:req.OtherInfo.ActivityTime,
		}
		err = dao.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"otherinfo":otherInfo}})
		/*
	default:
		resp.Status=500
		resp.Description="Undefined Type"
		return nil*/
	}
	if err!=nil{
		log.Println(err)
		return err
	}
	resp.Status=200
	resp.Description="OK"
	log.Println("Modify successfully")
	return nil
}
