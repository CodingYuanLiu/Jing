package main

import (
	"context"
	"fmt"
	activity "ActivityService/proto"
	"github.com/micro/go-micro"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("Jing.srv.act",service.Client())
	rsp,err:= c1.Publish(context.TODO(), &activity.PubReq{
		Type:"Taxi",
		Info: &activity.BasicInfo{
			CreateTime:"2019.6.5",
			EndTime:"2019 6.6",
			Title:"To Big Joy City at 7.6 afternoon",
			Description:"Anothor description",
			Tag: []string{"Joy City","Taxi"},
		},
		Taxiinfo: &activity.TaxiInfo{
			DepartTime:"2019-7-10 15:41:00",
			Origin:"Minhang",
			Destination:"Xinzhuang",
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}
