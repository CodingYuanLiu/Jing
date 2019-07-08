package main

import (
	"fmt"
	"log"
	"context"
	activity "ActivityService/proto"
	"github.com/micro/go-micro"
	"gopkg.in/mgo.v2"
	//"gopkg.in/mgo.v2/bson"
	"ActivityService/Model"
)

type Activity struct{
	Collection *mgo.Collection
}

func (act *Activity) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	insert(req,act.Collection)
	resp.Status=200
	resp.Description="OK"
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection) error {
	newact := Model.BasicAct{
		Actid:req.Actid,
		Type:req.Type,
		CreateTime:req.CreateTime,
		EndTime:req.EndTime,
		Title:req.Title,
		Description:req.Description,
		Tag:req.Tag,
	}
	err := collection.Insert(newact)
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	return err
}

func main(){
	service:=micro.NewService(
		micro.Name("testact"),
		micro.Address("127.0.0.1:50010"),
		)
	session, err := mgo.Dial("127.0.0.1:27017")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	collection := session.DB("Jing").C("Activity")

	service.Init()
	actservice := new(Activity)
	actservice.Collection = collection
	activity.RegisterActivityHandler(service.Server(),actservice)
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}
