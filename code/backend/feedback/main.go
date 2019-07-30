package main

import (
	"github.com/micro/go-micro"
	k8s "github.com/micro/kubernetes/go/micro"
	"jing/app/feedback/handler"
	feedback "jing/app/feedback/proto"
	"log"
	"time"
)

func main() {
	service := k8s.NewService(
		micro.Name("feedback"),
		micro.Address(":8080"),
		micro.RegisterTTL(time.Second*30),
		micro.RegisterInterval(time.Second*10),
	)

	service.Init()
	feedbackService := new(handler.FeedbackSrv)

	if err:=feedback.RegisterFeedbackSrvHandler(service.Server(),feedbackService);err!=nil{
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}

