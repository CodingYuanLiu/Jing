package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"log"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, actSrv.Collection)
	resp.Status = 200
	resp.Description="OK"
	resp.Actid = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection) int32 {
	id := GetId()
	basicinfo := model.BasicInfo{
		//Actid:id,
		Type:req.Info.Type,
		CreateTime:req.Info.CreateTime,
		EndTime:req.Info.EndTime,
		Title:req.Info.Title,
		Description:req.Info.Description,
		Tag:req.Info.Tag,
	}
	var err error
	switch basicinfo.Type{
	case "Taxi":
		newact := model.TaxiAct{
			Actid:id,
			BasicInfo:basicinfo,
			TaxiInfo: model.TaxiInfo{
				DepartTime:req.Taxiinfo.DepartTime,
				Origin:req.Taxiinfo.Origin,
				Destination:req.Taxiinfo.Destination,
			},
		}
		err = collection.Insert(newact)
	case "Takeout":
		newact := model.TakeoutAct{
			Actid:id,
			BasicInfo:basicinfo,
			TakeoutInfo:model.TakeoutInfo{
				Store:req.Takeoutinfo.Store,
				OrderTime:req.Takeoutinfo.Ordertime,
			},
		}
		err = collection.Insert(newact)
	default:
		fmt.Println("Undefined Type.")
	}
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	err = collection.Update(
		bson.M{"_id": bson.ObjectIdHex("5d23f2a372df504ce4aa856a")},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	if err!=nil{
		log.Fatal(err)
		return id
	}
	return id
}
