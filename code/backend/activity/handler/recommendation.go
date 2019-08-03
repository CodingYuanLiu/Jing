package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"jing/app/jing"
	"log"
	"math"
	"math/rand"
)

//Maximum number of the user that is compared with the user.
const userTotal = 10

func (actSrv *ActivitySrv) Recommendation(ctx context.Context,req *activity.RecommendReq,resp *activity.RecommendResp) error {
	/*
	   Error code:
	   0 for the user or all the another users have no behavior
	   1 for the nearest user has no activity.
	*/

	userId := req.UserId
	cachedResult := dao.GetRecommendationResultFromRedis(userId)
	if cachedResult != nil && len(cachedResult) != 0{
		log.Println("Get result from redis")
		resp.ActId = cachedResult
		return nil
	}

	userBehavior := dao.UserBehavior{}
	err := dao.BehaviorCollection.Find(bson.M{"userid":userId}).One(&userBehavior)
	if err == mgo.ErrNotFound{
		log.Println("Recommendation srv error: no behavior yet")
		return jing.NewError(301,404,"Recommendation srv error: no behavior yet")
	}


	var count int
	iter := dao.BehaviorCollection.Find(nil).Iter()

	count,err = dao.BehaviorCollection.Find(nil).Count()
	if err !=nil{
		log.Println("get count error")
		log.Println(err)
		return jing.NewError(300,400,"get count error")
	}
	var anotherUser dao.UserBehavior
	//Find users partially randomly
	start,number := GetComparedUsers(count)
	for i:=0;i<start;i++{
		iter.Next(&anotherUser)
	}

	var nearestAngle float64 = 0
	var nearestUserId int32 = 0
	for iter.Next(&anotherUser){
		if anotherUser.UserId == userBehavior.UserId || anotherUser.UserId == 0{
			continue
		}

		angle := GetAngle(userBehavior, anotherUser)
		//For debug
		log.Printf("Angel between %d and %d is %f\n",userBehavior.UserId,anotherUser.UserId,angle)
		if angle > nearestAngle{
			nearestAngle = angle
			nearestUserId = anotherUser.UserId
		}

		number -= 1
		if number == 0{
			break
		}
	}
	/* All the other users have no behavior*/
	if nearestAngle == 0{
		return jing.NewError(0,400,"the user or all the other users have no behavior")
	}

	//For debug
	log.Printf("The nearest user is %d\n",nearestUserId)
	acts := dao.GetAllUserActivityInt32(int(nearestUserId))
	if len(acts) == 0{
		return jing.NewError(1,400,"the nearest user has no activity")
	}

	resp.ActId = acts
	dao.SetRecommendationResultToRedis(userId,acts)
	return nil
}

func GetAngle(user dao.UserBehavior, anotherUser dao.UserBehavior) float64{
	// cos(AB) = A*B/(|A|*|B|)
	pA := user.Portrait
	pB := anotherUser.Portrait
	A := math.Sqrt(pA[0]*pA[0] + pA[1]*pA[1] + pA[2]*pA[2] + pA[3]*pA[3])
	B := math.Sqrt(pB[0]*pB[0] + pB[1]*pB[1] + pB[2]*pB[2] + pB[3]*pB[3])
	if A == 0 || B == 0{
		return 0
	}
	return (pA[0] * pB[0] + pA[1] * pB[1] + pA[2] * pB[2] + pA[3] * pB[3])/(A*B)
}

func GetComparedUsers(count int) (start int, number int){
	if count <= userTotal + 1{
		log.Println("All the users is comparable")
		start = 0
		number = count - 1
		return
	} else{
		number = userTotal
		log.Printf("start index range:%d\n" ,count - userTotal - 1)
		start = rand.Intn(count - userTotal - 1)
		log.Printf("start index:%d\n" ,start)
		return
	}
}