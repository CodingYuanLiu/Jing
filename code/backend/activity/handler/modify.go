package handler

import (
	"context"
	"errors"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
	"strconv"
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
	if mapBasicInfo["status"].(int) == 2{
		log.Println("cannot modify expired activity")
		resp.Status = 500
		resp.Description = "cannot modify expired activity"
		return errors.New("cannot modify expired activity")
	}
	fetchType:= mapBasicInfo["type"].(string)

	basicInfo:=dao.BasicInfo{
		Type:        fetchType,
		Title:       mapBasicInfo["title"].(string),
		CreateTime:  req.CreateTime,
		EndTime:     req.EndTime,
		Description: req.Description,
		Tag:         req.Tag,
		MaxMember:   req.MaxMember,
		Status :     dao.GetOverdueStatus(req.EndTime,dao.GetMaxMemberStatus(req.ActId,req.MaxMember)),
	}

	for i:=0;i<len(mapBasicInfo["images"].([]interface{}));i++{
		name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(int(req.ActId)),strconv.Itoa(i))
		err = dao.DeleteImgWithName(name)
		if err != nil{
			log.Printf("Catch delete error from dao,cannot delete pictures for act %d, pic %d\n",req.ActId,i)
			continue
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
		return err2
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
		return err
	}
	resp.Status=200
	resp.Description="OK"
	log.Println("Modify successfully")
	return nil
}
