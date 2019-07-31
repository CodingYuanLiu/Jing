package main

import (
	"context"
	"fmt"
	"github.com/micro/go-micro"
	feedback "jing/app/feedback/proto"
	"log"
)

func main() {
	service := micro.NewService()
	service.Init()
	c1 := feedback.NewFeedbackSrvService("feedback", service.Client())
	resp,err := c1.Comment(context.TODO(),&feedback.CmtReq{
		CommentatorId:3,
		Time: "2019-7-29 17:17:36",
		CommentDesc:"乱说",
		ObjectId: "5d3eba541a4eb64d5c3ddbe4",
	})
	if err != nil{
		log.Println(err)
	}
	fmt.Println(resp)
	return
}
