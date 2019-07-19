package main

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"

	"github.com/micro/go-micro"
	//k8s "github.com/micro/kubernetes/go/micro"
	"jing/app/activity/handler"
	activity "jing/app/activity/proto"
)

//The struct is used to store stylistic id in MongoDB.


func main() {
	service := micro.NewService(
		micro.Name("act"),
		micro.Address("127.0.0.1:10080"),
		micro.RegisterTTL(time.Second*30),
		micro.RegisterInterval(time.Second*10),
	)
	session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")
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
		//handler.Id = 0
		id := new(handler.Id)
		id.AutoId = int32(0)
		id.Lock = false
		insertErr := idCollection.Insert(id)
		if insertErr !=nil{
			log.Fatal(insertErr)
		}
	}else if err !=nil{
		log.Fatal("not mg")
		log.Fatal(err)
	}else {
		/* The fetchId["autoid"] can only be converted to int, not int32.*/
		/*
			intId := fetchId["autoid"].(int)
			handler.Id = int32(intId)
		*/
	}
	service.Init()
	actService := new(handler.ActivitySrv)
	actService.Collection = collection
	actService.IdCollection = idCollection
	if err:=activity.RegisterActivitySrvHandler(service.Server(),actService);err!=nil{
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal("end")
		log.Fatal(err)
	}
}
