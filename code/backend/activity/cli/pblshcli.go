package main

import (
	"context"
	"fmt"
	activity "jing/app/activity/proto"
	"github.com/micro/go-micro"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("Jing.handler.act",service.Client())
	rsp,err:= c1.Publish(context.TODO(), &activity.PubReq{
		/*
		Info: &activity.BasicInfo{
			Type:"Taxi",
			CreateTime:"2019.6.5",
			EndTime:"2019 7.6",
			Title:"To Big Joy City at 7.6 afternoon",
			Description:"Anothor description",
			Tag: []string{"Joy City","Taxi"},
		},
		Taxiinfo: &activity.TaxiInfo{
			DepartTime:"2019-7-10 15:41:00",
			Origin:"Minhang",
			Destination:"Xinzhuang",
		},*/
		Info: &activity.BasicInfo{
			Type:"Takeout",
			CreateTime:"2020-6-5",
			EndTime:"2020-7-6",
			Title:"BK in the noon",
			Description:"Takeout description",
			Tag: []string{"KFC","Element"},
		},
		Takeoutinfo: &activity.TakeoutInfo{
			Ordertime:"2019-7-10 15:41:00",
			Store:"BK",
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}
