package main

import (
	"encoding/json"
	"fmt"
	"github.com/gomodule/redigo/redis"
	"log"
	"time"
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
	conn,err := redis.Dial("tcp","localhost:6379")
	if err != nil{
		return
	}

	var actIds = []int{21,22,23}

	n, err := conn.Do("SET","key",actIds)
	if err != nil{
		log.Fatal(err)
	}

	fmt.Print("set value:")
	fmt.Println(n)


	n, err = redis.String(conn.Do("GET", "key"))
	if err != nil{
		log.Fatal(err)
	}
	b := []byte(n.(string))

	_ = json.Unmarshal(b,actIds)
	fmt.Println(actIds[1])


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
	n,err = conn.Do("ttl","key")
	if err != nil{
		log.Fatal(err)
	}
	fmt.Println(n)
	n,err = conn.Do("get","key")
	if err == redis.ErrNil{
		log.Println("NILNILNIL!!!")
	} else if err != nil{
		log.Fatal(err)
	}
	if n!= nil{
		fmt.Println(n)
	}

}
