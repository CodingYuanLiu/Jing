package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
)

func (actSrv *ActivitySrv) Delete(ctx context.Context,req *activity.DltReq,resp *activity.DltResp) error {
	err := actSrv.Collection.Remove(bson.M{"actid": req.Actid})
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		resp.Status = 500
		resp.Description = "Not Found"
		return err
	} else if err!=nil{
		return err
	} else{
		resp.Status = 200
		resp.Description = "OK"
	}
	return nil
}
