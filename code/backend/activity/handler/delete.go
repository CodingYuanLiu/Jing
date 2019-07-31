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

func (actSrv *ActivitySrv) Delete(ctx context.Context,req *activity.DltReq,resp *activity.DltResp) error {
	var result  map[string] interface{}
	err := dao.Collection.Find(bson.M{"actid": req.ActId}).One(&result)
	if err == mgo.ErrNotFound{
		log.Println("Can not find the removed activity")
		resp.Description = "Not Found"
		return jing.NewError(301,404,"Can not find the removed activity")
	}
	mapBasicInfo := result["basicinfo"].(map[string] interface{})
	imagesLen := len(mapBasicInfo["images"].([]interface{}))
	for i:=0;i<imagesLen;i++{
		name := fmt.Sprintf("actImage/act%s/img%s",strconv.Itoa(int(req.ActId)),strconv.Itoa(i))
		err = dao.DeleteImgWithName(name)
		if err != nil{
			log.Printf("Catch delete error from dao,cannot delete pictures for act %d, pic %d\n",req.ActId,i)
			continue
		}
		log.Printf("Deleted pictures for act %d, pic %d\n",req.ActId,i)
	}
	if err != nil{
		return jing.NewError(300,400,"Delete activity from qiniu error")
	}

	err = dao.Collection.Remove(bson.M{"actid": req.ActId})
	if err!=nil{
		log.Println(err)
		return jing.NewError(300,400,"Delete activity from mongoDB error")
	} else{
		log.Println("Delete activity successfully.")
		resp.Description = "delete activity successfully"
	}
	return nil
}
