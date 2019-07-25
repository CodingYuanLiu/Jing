package main

import (
	"github.com/micro/go-micro"
	//k8s "github.com/micro/kubernetes/go/micro"
	"jing/app/activity/handler"
	activity "jing/app/activity/proto"
	"log"
	"time"
)

//The struct is used to store stylistic id in MongoDB.


func main() {
	service := micro.NewService(
		micro.Name("act"),
		micro.Address("127.0.0.1:10180"),
		micro.RegisterTTL(time.Second*30),
		micro.RegisterInterval(time.Second*10),
	)

	service.Init()
	actService := new(handler.ActivitySrv)

	if err:=activity.RegisterActivitySrvHandler(service.Server(),actService);err!=nil{
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}
