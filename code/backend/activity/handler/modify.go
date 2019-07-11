package handler

import (
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (activity *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act map[string]interface{}
	err := activity.Collection.Find(bson.M{"actid": req.Actid}).One(&act)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}
	map_basicinfo :=act["basicinfo"].(map[string]interface{})
	fetch_type:=map_basicinfo["type"].(string)

	basicinfo:=model.BasicInfo{
		Type:fetch_type,
		Title:map_basicinfo["title"].(string),
		CreateTime:req.CreateTime,
		EndTime:req.EndTime,
		Description:req.Description,
		Tag:req.Tag,
	}

	switch fetch_type{
	case "Taxi":
		taxiinfo := model.TaxiInfo{
			DepartTime:req.Taxiinfo.DepartTime,
			Origin:req.Taxiinfo.Origin,
			Destination:req.Taxiinfo.Destination,
		}

		err = activity.Collection.Update(
		bson.M{"actid":req.Actid},
		bson.M{"$set":bson.M{"basicinfo":basicinfo,"taxiinfo":taxiinfo}})
	case "Takeout":
		takeoutinfo:=model.TakeoutInfo{
			Store:req.Takeoutinfo.Store,
			OrderTime:req.Takeoutinfo.Ordertime,
		}
		err = activity.Collection.Update(
			bson.M{"actid":req.Actid},
			bson.M{"$set":bson.M{"basicinfo":basicinfo,"takeoutinfo":takeoutinfo}})
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
