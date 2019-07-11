package handler

import (
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (actSrv *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act map[string]interface{}
	err := actSrv.Collection.Find(bson.M{"actid": req.Actid}).One(&act)
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
	case "Taxi":
		taxiInfo := model.TaxiInfo{
			DepartTime:req.Taxiinfo.DepartTime,
			Origin:req.Taxiinfo.Origin,
			Destination:req.Taxiinfo.Destination,
		}

		err = actSrv.Collection.Update(
		bson.M{"actid":req.Actid},
		bson.M{"$set":bson.M{"basicinfo":basicInfo,"taxiinfo":taxiInfo}})
	case "Takeout":
		takeoutInfo:=model.TakeoutInfo{
			Store:req.Takeoutinfo.Store,
			OrderTime:req.Takeoutinfo.Ordertime,
		}
		err = actSrv.Collection.Update(
			bson.M{"actid":req.Actid},
			bson.M{"$set":bson.M{"basicinfo":basicInfo,"takeoutinfo":takeoutInfo}})
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
