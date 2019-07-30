package main

import (
	"context"
	"fmt"
	"github.com/micro/go-micro"
	activity "jing/app/activity/proto"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("go.micro.handler.act",service.Client())
	rsp,err:= c1.Comment(context.TODO(), &activity.CmtReq{
		ActId:1,
		UserId:1,
		ReceiverId:2,
		Time: "2019-10-13 12:32:21",
		Content:"Second Comment",
	})
	if err != nil {
		fmt.Println(err)
		//return
	}

	fmt.Println(rsp)
}

