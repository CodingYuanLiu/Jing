package main

import (
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"github.com/micro/go-micro"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("Jing.handler.act",service.Client())
	rsp,err:= c1.Delete(context.TODO(), &activity.DltReq{
		ActId:8,
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(rsp)
}
