package main

import (
	"github.com/micro/go-micro"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/activity/handler"
	activity "jing/app/activity/proto"
	"log"
)

type id struct{
	AutoId int32
}
func main(){
	service:=micro.NewService(
		micro.Name("Jing.handler.act"),
		micro.Address("127.0.0.1:50010"),
		)
	session, err := mgo.Dial("mongodb://jing:jing@127.0.0.1:27017/Jing")
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()
	/* Used to store id */
	idCollection := session.DB("Jing").C("AutoId")
	collection := session.DB("Jing").C("Activity")
	//objectId:=bson.ObjectIdHex("5d23f2a372df504ce4aa856a")
	fetchId := bson.M{}
	err = idCollection.Find(nil).One(&fetchId)
	if err == mgo.ErrNotFound{
		handler.Id = 0
		id := new(id)
		id.AutoId = int32(0)
		idCollection.Insert(id)
	}else if err !=nil{
		log.Fatal(err)
	}else {
		/* The fetchId["autoid"] can only be converted to int, not int32.*/
		intId := fetchId["autoid"].(int)
		handler.Id = int32(intId)
	}
	service.Init()
	actService := new(handler.ActivitySrv)
	actService.Collection = collection
	actService.IdCollection = idCollection
	if err:=activity.RegisterActivitySrvHandler(service.Server(),actService);err!=nil{
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}
