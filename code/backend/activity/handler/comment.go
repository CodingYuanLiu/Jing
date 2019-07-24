package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) Comment(ctx context.Context,req *activity.CmtReq,resp *activity.CmtResp) error {
	comment := dao.Comment{
		UserId:req.UserId,
		ReceiverId:req.ReceiverId,
		Content:req.Content,
		Time:req.Time,
	}
	err := dao.Collection.Update(
		bson.M{"actid":req.ActId},
		bson.M{"$push":bson.M{"comments":comment}})
	if err == mgo.ErrNotFound{
		resp.Status = 404
		resp.Description = "Not Found"
		log.Println("Can't find the activity")
		return err
	}	else if err!=nil{
		resp.Status = 500
		resp.Description = "Comment Error"
		log.Println("Comment Error")
		return err
	}	else{
		resp.Status = 200
		resp.Description = "OK"
		log.Println("Comment successfully")
	}
	return nil
}
