package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
)

func (actSrv *ActivitySrv) Comment(ctx context.Context,req *activity.CmtReq,resp *activity.CmtResp) error {
	comment := model.Comment{
		UserId:req.UserId,
		ReceiverId:req.ReceiverId,
		Content:req.Content,
	}
	err := actSrv.Collection.Update(
		bson.M{"actid":req.ActId},
		bson.M{"$push":bson.M{"comments":comment}})
	if err == mgo.ErrNotFound{
		resp.Status = 404
		resp.Description = "Not Found"
		return err
	}	else if err!=nil{
		resp.Status = 500
		resp.Description = "Comment Error"
		return err
	}	else{
		resp.Status = 200
		resp.Description = "OK"
	}
	return nil
}
