package main

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	//"jing/app/dao"
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
func main(){

	session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")
	if err != nil{
		log.Println(err)
	}

	collection := session.DB("Jing").C("Activity")
	index := mgo.Index{
		Key: []string{"$text:basicinfo.description"},
	}
	err = collection.EnsureIndex(index)

	if err != nil{
		fmt.Print("err:" + err.Error())
	}
	var result []map[string]interface{}
	err = collection.Find(bson.M{"$text":bson.M{"$search":"basketball"}}).All(&result)
	if err != nil {
		fmt.Print("err:" + err.Error())
	}else{
		fmt.Println("result:")
		fmt.Println(result)
	}
}
