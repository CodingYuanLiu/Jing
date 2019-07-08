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
	c1 := activity.NewActivityService("testact",service.Client())
	rsp,err:= c1.Publish(context.TODO(), &activity.PubReq{
		Actid:2,
		Type:"Taxi",
		CreateTime:"2019.7.5",
		EndTime:"2019.7.6",
		Title:"To Joy City at 7.6 afternoon",
		Description:"Anothor description",
		Tag: []string{"Joy City","Taxi"},
		})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}
