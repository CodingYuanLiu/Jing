package handler

import (
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, actSrv.Collection, actSrv.IdCollection)
	resp.Status = 200
	resp.Description="OK"
	resp.Actid = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection,idCollection *mgo.Collection) int32 {
	id := GetId()
	basicInfo := model.BasicInfo{
		//Actid:id,
		Type:req.Info.Type,
		CreateTime:req.Info.CreateTime,
		EndTime:req.Info.EndTime,
		Title:req.Info.Title,
		Description:req.Info.Description,
		Tag:req.Info.Tag,
	}
	var err error
	switch basicInfo.Type{
	case "Taxi":
		newAct := model.TaxiAct{
			Actid:     id,
			BasicInfo: basicInfo,
			TaxiInfo: model.TaxiInfo{
				DepartTime:req.Taxiinfo.DepartTime,
				Origin:req.Taxiinfo.Origin,
				Destination:req.Taxiinfo.Destination,
			},
		}
		err = collection.Insert(newAct)
	case "Takeout":
		newAct := model.TakeoutAct{
			Actid:     id,
			BasicInfo: basicInfo,
			TakeoutInfo:model.TakeoutInfo{
				Store:req.Takeoutinfo.Store,
				OrderTime:req.Takeoutinfo.Ordertime,
			},
		}
		err = collection.Insert(newAct)
	default:
		fmt.Println("Undefined Type.")
	}
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	err = idCollection.Update(
		bson.M{"autoid": id-1},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	if err!=nil{
		log.Fatal(err)
		return id
	}
	return id
}
