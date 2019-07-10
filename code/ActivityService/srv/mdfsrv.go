package srv

import (
	"ActivityService/Model"
	activity "ActivityService/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (activity *ActivitySrv) Modify(ctx context.Context,req *activity.MdfReq,resp *activity.MdfResp) error {
	var act Model.BasicAct
	err := activity.Collection.Find(bson.M{"actid": req.Actid}).One(&act)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}
	err = activity.Collection.Update(
		bson.M{"actid":req.Actid},
		bson.M{"$set":bson.M{"createtime":req.CreateTime,"endtime":req.EndTime,
			"description":req.Description,"tag":req.Tag}})
	if err!=nil{
		fmt.Println(err)
		return err
	}
	resp.Status=200
	resp.Description="OK"
	return nil
}
