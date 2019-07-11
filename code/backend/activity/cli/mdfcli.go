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
	rsp,err:= c1.Modify(context.TODO(), &activity.MdfReq{
		/*
		Actid:5,
		CreateTime:"2015-7-7",
		EndTime:"2015-7-17",
		Description:"Modified description",
		Tag: []string{"Joy City","Taxi"},
		Taxiinfo: &activity.TaxiInfo{
			DepartTime:"2020-7-7 12:21:32",
			Origin:"ModifiedOrigin",
			Destination:"ModifiedDest",
		},*/
		Actid:8,
		CreateTime:"2075-7-7",
		EndTime:"2075-7-17",
		Description:"Modified takeout description",
		Tag: []string{"BurgerKing","Element"},
		Takeoutinfo:&activity.TakeoutInfo{
			Store:"Burger King",
			Ordertime:"2077-7-7",
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}

