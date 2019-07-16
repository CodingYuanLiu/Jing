package main

import (
	"jing/app/activity/handler"
	activity "jing/app/activity/proto"
	"log"

	"github.com/micro/go-micro"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	k8s "github.com/micro/kubernetes/go/micro"
)

//The struct is used to store stylistic id in MongoDB.
type id struct{
	AutoId int32
}

func main() {
	service := k8s.NewService(
		micro.Name("act"),
		micro.Address(":8080"),
	)
	session, err := mgo.Dial("mongodb://jing:jing@mongo.database:27017/Jing")
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
		insertErr := idCollection.Insert(id)
		if insertErr !=nil{
			log.Fatal(insertErr)
		}
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
