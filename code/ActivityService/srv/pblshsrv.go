package srv

import (
	"ActivityService/Model"
	activity "ActivityService/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (activity *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, activity.Collection)
	resp.Status = 200
	resp.Description="OK"
	resp.Actid = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection) int32 {
	id := GetId()
	newact := Model.BasicAct{
		Actid:id,
		Type:req.Type,
		CreateTime:req.CreateTime,
		EndTime:req.EndTime,
		Title:req.Title,
		Description:req.Description,
		Tag:req.Tag,
	}
	err := collection.Insert(newact)
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	collection.Update(
		bson.M{"_id": bson.ObjectIdHex("5d23f2a372df504ce4aa856a")},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	return id
}
