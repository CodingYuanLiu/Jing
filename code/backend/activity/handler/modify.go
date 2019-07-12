package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
)

func (actSrv *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act map[string]interface{}
	err := actSrv.Collection.Find(bson.M{"actid": req.ActId}).One(&act)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}
	mapBasicInfo :=act["basicinfo"].(map[string]interface{})
	fetchType:= mapBasicInfo["type"].(string)

	basicInfo:=model.BasicInfo{
		Type:        fetchType,
		Title:       mapBasicInfo["title"].(string),
		CreateTime:  req.CreateTime,
		EndTime:     req.EndTime,
		Description: req.Description,
		Tag:         req.Tag,
	}

	switch fetchType{
	case "taxi":
		taxiInfo := model.TaxiInfo{
			DepartTime:req.TaxiInfo.DepartTime,
			Origin:req.TaxiInfo.Origin,
			Destination:req.TaxiInfo.Destination,
		}
		err = actSrv.Collection.Update(
		bson.M{"actid":req.ActId},
		bson.M{"$set":bson.M{"basicinfo":basicInfo,"taxiinfo":taxiInfo}})
	case "takeout":
		takeoutInfo:=model.TakeoutInfo{
			Store:req.TakeoutInfo.Store,
			OrderTime:req.TakeoutInfo.OrderTime,
		}
		err = actSrv.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"takeoutinfo":takeoutInfo}})
	case "order":
		orderInfo := model.OrderInfo{
			Store:req.OrderInfo.Store,
		}
		err = actSrv.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"orderinfo":orderInfo}})
	case "other":
		otherInfo := model.OtherInfo{
			ActivityTime:req.OtherInfo.ActivityTime,
		}
		err = actSrv.Collection.Update(
			bson.M{"actid":req.ActId},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"otherinfo":otherInfo}})
	default:
		resp.Status=500
		resp.Description="Undefined Type"
		return nil
	}
	if err!=nil{
		fmt.Println(err)
		return err
	}
	resp.Status=200
	resp.Description="OK"
	return nil
}
