package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) Recommendation(ctx context.Context,req *activity.RecommendReq,resp *activity.RecommendResp) error {
	userId := req.UserId
	userBehavior := dao.UserBehavior{}
	err := dao.BehaviorCollection.Find(bson.M{"userid":userId}).One(userBehavior)
	if err == mgo.ErrNotFound{
		log.Println("Recommendation srv error: no behavior yet")
		resp.Status = 500
		resp.ActId = []int32{}
		return nil
	}
	var anotherUser dao.UserBehavior
	var nearestAngle float32 = 0
	var nearestUserId int32 = 0
	iter := dao.BehaviorCollection.Find(nil).Iter()
	for iter.Next(&anotherUser){
		if anotherUser.UserId == userBehavior.UserId{
			continue
		}
		angle := GetAngle(userBehavior, anotherUser)
		if angle > nearestAngle{
			nearestAngle = angle
			nearestUserId = anotherUser.UserId
		}
	}
	return nil
}

func GetAngle(user dao.UserBehavior, anotherUser dao.UserBehavior) float32{

}