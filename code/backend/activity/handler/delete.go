package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
	"strconv"
)

func (actSrv *ActivitySrv) Delete(ctx context.Context,req *activity.DltReq,resp *activity.DltResp) error {
	var result  map[string] interface{}
	err := actSrv.Collection.Find(bson.M{"actid": req.ActId}).One(&result)
	if err == mgo.ErrNotFound{
		log.Println("Can not find the removed activity")
		resp.Status = 404
		resp.Description = "Not Found"
		return err
	}
	mapBasicInfo := result["basicinfo"].(map[string] interface{})
	imagesLen := len(mapBasicInfo["images"].([]interface{}))
	for i:=0;i<imagesLen;i++{
		name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(int(req.ActId)),strconv.Itoa(i))
		dao.DeleteImgWithName(name)
	}
	log.Println("Deleted pictures.")
	err = actSrv.Collection.Remove(bson.M{"actid": req.ActId})

	if err == mgo.ErrNotFound{
		log.Println(err)
		resp.Status = 404
		resp.Description = "Not Found"
		return err
	} else if err!=nil{
		log.Println(err)
		return err
	} else{
		log.Println("Delete activity successfully.")
		resp.Status = 200
		resp.Description = "OK"
	}
	return nil
}
