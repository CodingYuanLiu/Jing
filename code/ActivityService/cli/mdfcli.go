package main

import (
	activity "ActivityService/proto"
	"context"
	"fmt"
	"github.com/micro/go-micro"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("Jing.srv.act",service.Client())
	rsp,err:= c1.Modify(context.TODO(), &activity.MdfReq{
		Actid:3,
		CreateTime:"2019.7.7",
		EndTime:"2019.7.17",
		Description:"Modified description",
		Tag: []string{"mJoy City","mTaxi"},
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}

