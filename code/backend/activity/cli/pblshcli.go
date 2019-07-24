package main

import (
	"context"
	"fmt"
	"github.com/micro/go-micro"
	activity "jing/app/activity/proto"
	"os"
)

func main(){
	service :=micro.NewService()
	service.Init()
	c1 := activity.NewActivitySrvService("act",service.Client())
	//img1,_:=file2Bytes("./testqiniu1.png")
	//img2,_:=file2Bytes("./testqiniu2.png")
	rsp,err:= c1.Publish(context.TODO(), &activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"taxi",
			CreateTime:"2019.6.5",
			EndTime:"2019 7.6",
			Title:"To Big Joy City at 7.6 afternoon",
			Description:"Anothor description",
			Tag: []string{"Joy City","Taxi"},
			Images:[]string{},
		},
		TaxiInfo: &activity.TaxiInfo{
			DepartTime:"2019-7-10 15:41:00",
			Origin:"Minhang",
			Destination:"Xinzhuang",
		},
		/*
		Info: &activity.BasicInfo{
			Type:"takeout",
			CreateTime:"2020-6-5",
			EndTime:"2020-7-6",
			Title:"BK in the noon",
			Description:"Takeout description",
			Tag: []string{"KFC","Element"},
		},
		TakeoutInfo: &activity.TakeoutInfo{
			OrderTime:"2019-7-10 15:41:00",
			Store:"BK",
		},*/
		/*
		Info: &activity.BasicInfo{
			Type:"order",
			CreateTime:"2020-10-5",
			EndTime:"2020-12-6",
			Title:"Dior lipstick",
			Description:"description",
			Tag: []string{"Dior","Lipstick"},
		},
		OrderInfo: &activity.OrderInfo{
			Store:"Dior",
		},*/
		/*
		Info: &activity.BasicInfo{
			Type:"other",
			CreateTime:"2022-10-5",
			EndTime:"2022-12-6",
			Title:"Basketball this afternoon",
			Description:"description",
			Tag: []string{"Basketball"},
			Images:[]string{},
		},
		OtherInfo: &activity.OtherInfo{
			ActivityTime:"2022-11-11 11:11:21",
		},
		 */
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(rsp)
}


func file2Bytes(filename string) ([]byte, error) {

	// File
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// FileInfo:
	stats, err := file.Stat()
	if err != nil {
		return nil, err
	}

	// []byte
	data := make([]byte, stats.Size())
	count, err := file.Read(data)
	if err != nil {
		return nil, err
	}
	fmt.Printf("read file %s len: %d \n", filename, count)
	return data, nil
}