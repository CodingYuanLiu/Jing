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
	rsp,err:= c1.Delete(context.TODO(), &activity.DltReq{
		Actid:4,
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(rsp)
}
