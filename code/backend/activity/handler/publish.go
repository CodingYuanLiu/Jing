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
	"strconv"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, dao.Collection, dao.IdCollection)
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
	fetchId := bson.M{}
	err := idCollection.Find(nil).One(&fetchId)
	log.Println("Get autoid from mongoDB.")
	if err!=nil {
		log.Println("Get autoId error.")
		log.Fatal(err)
	}

	intId := fetchId["autoid"].(int)
	id = int32(intId)
	check := basicInfo.Type == "taxi" || basicInfo.Type == "takeout" || basicInfo.Type == "order" || basicInfo.Type == "other"
	if check{
		/* Upload the pictures and return the url */
		for i:=0;i<len(req.Info.Images);i++{
			name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(intId+1),strconv.Itoa(i))
			basicInfo.Images = append(basicInfo.Images, dao.UploadImgWithName(req.Info.Images[i],name))
		}
	}

	switch basicInfo.Type{
	case "taxi":
		id = id+1
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
		id = id+1
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
		id = id+1
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
		id = id+1
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
		log.Println("Undefined Type.")
		return -1
	}
	if err!=nil{
		log.Println("Insert Fail!")
	}
	err = idCollection.Update(
		bson.M{"autoid": id-1},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	log.Println("Inserted autoid.")
	if err!=nil{
		log.Fatal(err)
	}
	log.Println("Publish activity successfully")
	return id
}