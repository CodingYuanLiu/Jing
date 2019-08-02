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

func (actSrv *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act map[string]interface{}
	err := dao.Collection.Find(bson.M{"actid": req.ActId}).One(&act)
	if err == mgo.ErrNotFound{
		log.Println(err)
		return jing.NewError(301,404,"Can not find the activity")
	}

	mapBasicInfo :=act["basicinfo"].(map[string]interface{})
	if mapBasicInfo["status"].(int) == 2{
		log.Println("cannot modify expired activity")
		return jing.NewError(1,400,"Cannot modify expired activity")
	}

	fetchType:= mapBasicInfo["type"].(string)
	status := int32(mapBasicInfo["status"].(int))
	if status != -1{
		status = dao.GetMaxMemberStatus(req.ActId,req.MaxMember)
	}

	basicInfo:=dao.BasicInfo{
		Type:        fetchType,
		Title:       mapBasicInfo["title"].(string),
		CreateTime:  req.CreateTime,
		EndTime:     req.EndTime,
		Description: req.Description,
		Tag:         req.Tag,
		MaxMember:   req.MaxMember,
		Status :     dao.GetOverdueStatus(req.EndTime,dao.GetMaxMemberStatus(req.ActId,status)),
	}

	for i:=0;i<len(mapBasicInfo["images"].([]interface{}));i++{
		name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(int(req.ActId)),strconv.Itoa(i))
		err = dao.DeleteImgWithName(name)
		if err != nil{
			log.Printf("Catch delete error from dao,cannot delete pictures for act %d, pic %d\n",req.ActId,i)
			return jing.NewError(300,400,"Can not delete pictures from qiniu")
		}
		log.Printf("Deleted pictures for act %d, pic %d\n",req.ActId,i)
	}

	var newImages []string
	var err2 error
	for i,param := range req.Images{
		name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(int(req.ActId)),strconv.Itoa(i))
		imageUrl, err := dao.UploadImgWithName(param,name)
		if err != nil{
			err2 = err
		}
		newImages = append(newImages,imageUrl)
	}
	if err2 != nil{
		log.Println(err2)
		return jing.NewError(300,400,"Can not upload image to qiniu when modifying")
	}

	for _,param := range newImages{
		basicInfo.Images = append(basicInfo.Images,param)
	}

	switch fetchType{
	case "taxi":
		var ori, dest map[string]interface{}
		_ = bson.Unmarshal(req.TaxiInfo.Origin, &ori)
		_ = bson.Unmarshal(req.TaxiInfo.Destination, &dest)
		taxiInfo := dao.TaxiInfo{
			DepartTime: req.TaxiInfo.DepartTime,
			Origin: ori,
			Destination: dest,
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
		return jing.NewError(300,400,"Can not update activity in mongoDB")
	}
	resp.Description="Modify activity successfully"
	log.Println("Modify successfully")
	return nil
}

