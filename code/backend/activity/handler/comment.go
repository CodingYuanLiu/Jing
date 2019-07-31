package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"jing/app/jing"
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
		resp.Description = "Not found"
		log.Println("Can't find the activity")
		return jing.NewError(301,404,"Can not find the activity")
	}	else if err!=nil{
		resp.Description = "Comment error"
		log.Println("Comment Error")
		return jing.NewError(300,404,"Can not comment the activity")
	}	else{
		resp.Description = "Comment successfully"
		log.Println("Comment successfully")
	}
	return nil
}
