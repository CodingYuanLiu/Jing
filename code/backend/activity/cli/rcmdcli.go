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
	c1 := activity.NewActivitySrvService("act",service.Client())
	rsp,err:= c1.Recommendation(context.TODO(), &activity.RecommendReq{
		UserId:2,
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(rsp)
}
