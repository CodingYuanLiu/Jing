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
	resp,err := c1.Query(context.TODO(),&feedback.QryReq{
		ReceiverId:int32(3),
	})
	if err != nil{
		log.Println(err)
		return
	}
	fmt.Println(resp)

}
