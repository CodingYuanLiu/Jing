package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis"
	"jing/app/dao"
	"log"
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
}
	client := redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:     []string{"redis.database:6379"},
		//Password: "", // no password set
		//DB:       0,  // use default DB
	})*/
	client := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "", // no password set
			DB:       0,  // use default DB
		})
	pong, err := client.Ping().Result()
	fmt.Println(pong, err)
	rawData := []int{1,2,3}
	data,_ := json.Marshal(rawData)
	err = client.Set("key", data, 3000000).Err()
	if err != nil{
		log.Println(err)
	}
	raw,err := client.Get("key").Result()
	if err != nil{
		log.Println(err)
	}
	fmt.Println(raw)

	basicInfo := dao.BasicInfo{
		Title:"test Title",
		Type:"Taxi",
		CreateTime:"2019-08-12 10:22:23",
		EndTime:"2019-08-12 10:24:23",
		Description:"Test Description",
		MaxMember: 3,
		Status: 0,
		Tag:[]string{},
	}
	byteOrigin := []byte("{\"origin\":123}")
	byteDestination := []byte("{\"destination\":456}")
	var origins map[string] interface{}
	var destinations map[string] interface{}
	_ = json.Unmarshal(byteOrigin, &origins)
	_ = json.Unmarshal(byteDestination, &destinations)

	objectAct := dao.TaxiAct{
		ActId:10086,
		BasicInfo:basicInfo,
		TaxiInfo:dao.TaxiInfo{
			DepartTime:  "2019-08-12 10:26:23",
			Origin:      origins,
			Destination: destinations,
		},
	}
	byteAct,err := json.Marshal(objectAct)
	if err != nil{
		log.Println(err)
	}

	err = client.Set("key", byteAct, 3000000).Err()
	if err != nil{
		log.Println(err)
	}

	stringAct,err := client.Get("key").Result()
	if err != nil{
		log.Println(err)
	}
	fmt.Println(stringAct)
	var result map[string]interface{}
	err = json.Unmarshal([]byte(stringAct),&result)
	if err != nil{
		log.Println(err)
	}
	fmt.Println(result)
	fmt.Println(result["BasicInfo"].(map[string]interface{})["Type"])
}
