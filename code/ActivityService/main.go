package main

import (
	activity "ActivityService/proto"
	"ActivityService/srv"
	"github.com/micro/go-micro"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

type autoid struct{
	Autoid int32
}

func main(){
	service:=micro.NewService(
		micro.Name("Jing.srv.act"),
		micro.Address("127.0.0.1:50010"),
		)
	session, err := mgo.Dial("127.0.0.1:27017")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	collection := session.DB("Jing").C("Activity")
	//objectId:=bson.ObjectIdHex("5d23f2a372df504ce4aa856a")
	id := new(autoid)
	//Now the self increasing id is stored in Activity Collection. A specific collection may be needed later.
 	collection.FindId(bson.ObjectIdHex("5d23f2a372df504ce4aa856a")).One(&id)
	srv.Id=id.Autoid
	service.Init()
	actservice := new(srv.ActivitySrv)
	actservice.Collection = collection
	if err:=activity.RegisterActivitySrvHandler(service.Server(),actservice);err!=nil{
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}
