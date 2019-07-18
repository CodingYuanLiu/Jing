package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, actSrv.Collection, actSrv.IdCollection)
	if id == -1{
		resp.Status = 500
		resp.Description = "Undefined Type"
		resp.ActId = -1
		return nil
	}
	resp.Status = 200
	resp.Description = "OK"
	resp.ActId = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection,idCollection *mgo.Collection) int32 {
	var id int32
	basicInfo := model.BasicInfo{
		//Actid:id,
		Type:req.Info.Type,
		CreateTime:req.Info.CreateTime,
		EndTime:req.Info.EndTime,
		Title:req.Info.Title,
		Description:req.Info.Description,
		Tag:req.Info.Tag,
		//Store the images into the mongoDB. Discard it now.
		//Images:req.Info.Images,
	}
	/* Upload the pictures and return the url */
	for _,param := range req.Info.Images{
		basicInfo.Images = append(basicInfo.Images, dao.UploadImg(param))
	}
	var err error
	switch basicInfo.Type{
	case "taxi":
		id = GetId()
		newAct := model.TaxiAct{
			ActId:     id,
			BasicInfo: basicInfo,
			TaxiInfo: model.TaxiInfo{
				DepartTime:req.TaxiInfo.DepartTime,
				Origin:req.TaxiInfo.Origin,
				Destination:req.TaxiInfo.Destination,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "takeout":
		id = GetId()
		newAct := model.TakeoutAct{
			ActId:      id,
			BasicInfo: basicInfo,
			TakeoutInfo:model.TakeoutInfo{
				Store:req.TakeoutInfo.Store,
				OrderTime:req.TakeoutInfo.OrderTime,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "order":
		id = GetId()
		newAct := model.OrderAct{
			ActId: id,
			BasicInfo:basicInfo,
			OrderInfo:model.OrderInfo{
				Store:req.OrderInfo.Store,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "other":
		id = GetId()
		newAct := model.OtherAct{
			ActId: id,
			BasicInfo:basicInfo,
			OtherInfo:model.OtherInfo{
				ActivityTime:req.OtherInfo.ActivityTime,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	default:
		fmt.Println("Undefined Type.")
		return -1
	}
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	err = idCollection.Update(
		bson.M{"autoid": id-1},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	if err!=nil{
		log.Fatal(err)
	}
	return id
}