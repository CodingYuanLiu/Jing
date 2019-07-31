package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"jing/app/jing"
	"log"
	"strconv"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id,err := insert(req, dao.Collection, dao.IdCollection)
	if err != nil{
		return err
	}
	/*
	if id == -1{
		resp.Status = 500
		resp.Description = "Undefined Type"
		resp.ActId = -1
		return nil
	}*/
	resp.Status = 200
	resp.Description = "OK"
	resp.ActId = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection,idCollection *mgo.Collection) (int32,error) {
	var id int32
	basicInfo := dao.BasicInfo{
		//Actid:id,
		Type:req.Info.Type,
		CreateTime:req.Info.CreateTime,
		EndTime:req.Info.EndTime,
		Title:req.Info.Title,
		Description:req.Info.Description,
		Tag:req.Info.Tag,
		MaxMember:	req.Info.MaxMember,
		Status:int32(0),
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
			image,err2 := dao.UploadImgWithName(req.Info.Images[i],name)
			if err2 != nil{
				return 0,err2
			}
			basicInfo.Images = append(basicInfo.Images, image)
		}
	}

	switch basicInfo.Type{
	case "taxi":
		var ori, dest map[string]interface{}
		_ = bson.Unmarshal(req.TaxiInfo.Origin, &ori)
		_ = bson.Unmarshal(req.TaxiInfo.Destination, &dest)
		id = id+1
		newAct := dao.TaxiAct{
			ActId:     id,
			BasicInfo: basicInfo,
			TaxiInfo: dao.TaxiInfo{
				DepartTime:req.TaxiInfo.DepartTime,
				Origin: ori,
				Destination: dest,
			},
		Comments: []dao.Comment{},
		}
		err = collection.Insert(newAct)
	case "takeout":
		id = id+1
		newAct := dao.TakeoutAct{
			ActId:      id,
			BasicInfo: basicInfo,
			TakeoutInfo:dao.TakeoutInfo{
				Store:req.TakeoutInfo.Store,
				OrderTime:req.TakeoutInfo.OrderTime,
			},
		Comments: []dao.Comment{},
		}
		err = collection.Insert(newAct)
	case "order":
		id = id+1
		newAct := dao.OrderAct{
			ActId: id,
			BasicInfo:basicInfo,
			OrderInfo:dao.OrderInfo{
				Store:req.OrderInfo.Store,
			},
		Comments: []dao.Comment{},
		}
		err = collection.Insert(newAct)
	case "other":
		id = id+1
		newAct := dao.OtherAct{
			ActId: id,
			BasicInfo:basicInfo,
			OtherInfo:dao.OtherInfo{
				ActivityTime:req.OtherInfo.ActivityTime,
			},
		Comments: []dao.Comment{},
		}
		err = collection.Insert(newAct)
	default:
		log.Println("Undefined Type.")
		return -1,jing.NewError(0,400,"Undefined type")
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
	return id,nil

}