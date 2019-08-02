package main

import (
	"fmt"
	"gopkg.in/mgo.v2/bson"
	"jing/app/dao"

	//"jing/app/dao"
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


	//var existFb []map[string] interface{}
	query := []bson.M{
		{"receiverid": int32(3)},
		{"userid": int32(2)},
		{"actid": int32(1)},
	}
	count,_ := dao.FeedbackCollection.Find(bson.M{"$and":query}).Count()
	fmt.Println(count)
	for i := 5;i<12;i++{
		err := dao.AddBehavior("search",i,"taxi")
		if err!=nil{
			fmt.Println(err.Error())
		}
	}
}
