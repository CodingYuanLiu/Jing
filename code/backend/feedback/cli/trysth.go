package main

import (
	"fmt"
	"jing/app/dao"
)

/*
func try1(){
	objectId := bson.NewObjectId()

	feedback := dao.Feedback{
		Id: objectId,
		UserId: 1,
		ReceiverId:3,
		ActId: 1,
		Communication:1,
		CommunicationDesc:"communication desc",
		Punctuality:1,
		PunctualityDesc: "punctuality desc",
		Honesty: 5,
		HonestyDesc: "honesty desc",
		FbComments:			[]dao.FeedbackComment{},
		FbImages:			[]string{"123"},
	}
	err := dao.FeedbackCollection.Insert(feedback)
	if err != nil{
		log.Println(err)
		return
	}
	var result dao.Feedback
	err = dao.FeedbackCollection.Find(bson.M{"_id":objectId}).One(&result)
	if err != nil{
		log.Println(err)
		return
	}
	fmt.Println(result)
	err = dao.FeedbackCollection.Remove(bson.M{"_id":objectId})
	if err != nil{
		log.Println(err)
		return
	}

	objectIdOld := "5d3e637c1a4eb61308c26bf2"
	fmt.Println(bson.IsObjectIdHex(objectIdOld))

}
*/

type testRedis struct{
	actIds []int
}

func main(){
	/*
	conn,err := redis.Dial("tcp","localhost:6379")
	if err != nil{
		log.Println(err)
		return
	}


	n, err := conn.Do("SET","key",actIds)
	if err != nil{
		log.Fatal(err)
	}

	fmt.Print("set value:")
	fmt.Println(n)


	raw, err := redis.String(conn.Do("GET", "key"))
	if err != nil{
		log.Fatal(err)
	}
	b := []byte(raw)
	var actIds1 []int32

	_ = json.Unmarshal(b,actIds1)
	fmt.Println(actIds1)
	fmt.Println(actIds1[1])


	_,err = conn.Do("expire","key",10)
	if err != nil {
		fmt.Println(err)
		return
	}
	time.Sleep(5*time.Second)
	n,err = conn.Do("ttl","key")
	if err != nil{
		log.Fatal(err)
	}
	fmt.Println(n)

	time.Sleep(6 * time.Second)
	n,err = conn.Do("ttl","key100")
	if err != nil{
		log.Fatal(err)
	}
	fmt.Println(n)
	n,err = conn.Do("get","key100")
	if err == redis.ErrNil{
		log.Println("NILNILNIL!!!")
	} else if err != nil{
		log.Fatal(err)
	}
	if n != nil{
		fmt.Println("not nil")
	}else{
		fmt.Println("nil")
	}
	*/
	var actIds = []int32{21,22,23}

	dao.SetRecommendationResultToRedis(1,actIds)
	acts := dao.GetRecommendationResultFromRedis(1)
	fmt.Println(acts[1])
}
