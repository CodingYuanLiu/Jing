package main

import (
	"context"
	"fmt"
	"github.com/micro/go-micro"
	"jing/app/feedback/proto"
	"log"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := feedback.NewFeedbackSrvService("feedback",service.Client())
	resp,err := c1.Publish(context.TODO(),&feedback.PubReq{
		UserId: 1,
		ReceiverId:3,
		ActId: 1,
		Communication:1,
		CommunicationDesc:"communication desc",
		Punctuality:1,
		PunctualityDesc: "punctuality desc",
		Honesty: 5,
		HonestyDesc: "honesty desc",
		FbImages:			[]string{"123","324123123563543"},
	})
	if err != nil{
		log.Println(err)
		return
	}
	fmt.Println(resp)
}
