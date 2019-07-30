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
	rsp,err:= c1.GenTags(context.TODO(), &activity.TagReq{
		Title:"星期六拼车去虹桥机场",
		Description:"计划星期六上午拼车去虹桥机场，找两个小伙伴一起打车去。",
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	for _,param := range rsp.Tag{
		fmt.Println("tag:"+param)
	}
}
