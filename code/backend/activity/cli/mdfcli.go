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
	c1 := activity.NewActivitySrvService("go.micro.handler.act",service.Client())
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
		/*
		ActId:7,
		CreateTime:"2075-7-7",
		EndTime:"2075-7-17",
		Description:"Modified takeout description",
		Tag: []string{"BurgerKing","Element"},
		TakeoutInfo:&activity.TakeoutInfo{
			Store:"Burger King",
			OrderTime:"2077-7-7",
		},*/
		/*
		ActId:7,
		CreateTime:"2015-7-7",
		EndTime:"2015-7-17",
		Description:"Modified order description",
		Tag: []string{"Dior","Taobao"},
		OrderInfo:&activity.OrderInfo{
			Store:"Taobao Dior",
		},*/
		ActId:1,
		CreateTime:"2025-7-7",
		EndTime:"2025-7-17",
		Description:"Modified other description",
		Tag: []string{"Dior","Taobao"},
		OtherInfo:&activity.OtherInfo{
			ActivityTime:"2025-11-11",
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}

