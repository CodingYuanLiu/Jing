package main

import (
	"context"
	"fmt"
	"github.com/micro/go-micro"
	feedback "jing/app/feedback/proto"
	"log"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := feedback.NewFeedbackSrvService("feedback",service.Client())
	resp,err := c1.Delete(context.TODO(),&feedback.DltReq{
		ObjectId:"5d3eba541a4eb64d5c3ddbe4",
	})
	if err != nil{
		log.Println(err)
		return
	}
	fmt.Println(resp)

}