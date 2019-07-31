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
	c1 := activity.NewActivitySrvService("act",service.Client())
	rsp,err:= c1.Query(context.TODO(), &activity.QryReq{
		ActId:1,
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(rsp)
	fmt.Println(rsp.BasicInfo.Status)
}
