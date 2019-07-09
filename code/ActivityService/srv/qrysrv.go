package srv

import (
	"ActivityService/Model"
	activity "ActivityService/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (activity *ActivitySrv) Query(ctx context.Context,req *activity.QryReq,resp *activity.QryResp) error {
	//fmt.Println(req)
	var act Model.BasicAct
	err := activity.Collection.Find(bson.M{"actid": req.Actid}).One(&act)
	if err == mgo.ErrNotFound{
		fmt.Println(err)
		return err
	}
	resp.Type = act.Type
	resp.Description = act.Description
	resp.Title = act.Title
	resp.CreateTime = act.CreateTime
	resp.EndTime = act.EndTime
	resp.Tag = act.Tag
	return nil
}
