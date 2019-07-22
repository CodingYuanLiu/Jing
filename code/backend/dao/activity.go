package dao

import (
	"errors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)
var Collection *mgo.Collection
var IdCollection *mgo.Collection

type BasicInfo struct{
	//ActId int32
	Type string
	CreateTime string
	EndTime string
	Title string
	Description string
	//Comments []Comment
	Tag []string
	Images []string
}

type TaxiInfo struct{
	DepartTime string
	Origin string
	Destination string
}

type TaxiAct struct{
	ActId int32
	BasicInfo BasicInfo
	TaxiInfo TaxiInfo
	Comments []Comment
}

type TakeoutInfo struct{
	Store string
	OrderTime string
}
type TakeoutAct struct{
	ActId int32
	TakeoutInfo TakeoutInfo
	BasicInfo BasicInfo
	Comments []Comment
}

type OrderInfo struct{
	Store string
}
type OrderAct struct{
	ActId int32
	BasicInfo BasicInfo
	OrderInfo OrderInfo
	Comments []Comment
}

type OtherInfo struct{
	ActivityTime string
}

type OtherAct struct {
	ActId int32
	BasicInfo BasicInfo
	OtherInfo OtherInfo
	Comments []Comment
}

type Comment struct {
	ReceiverId int32
	UserId int32
	Content string
	Time string
}

type Id struct{
	AutoId int32
	Lock bool
}

//取出来活动信息之后只留下ActId，再
func GetActsByType(actType string) ([]int,error){
	var retActs []int
	switch actType {
	case "taxi":{
		var taxiActs []TaxiAct
		err := Collection.Find(bson.M{"basicinfo.type":"taxi"}).All(&taxiActs)

		if err!=nil{
			log.Println(err)
		}
		for _,taxiAct := range taxiActs{
			retActs = append(retActs, int(taxiAct.ActId))
		}
	}
	case "other":{
		var otherActs []OtherAct
		err := Collection.Find(bson.M{"basicinfo.type":"other"}).All(&otherActs)
		if err!=nil{
			log.Println(err)
		}
		for _,otherAct := range otherActs{
			retActs = append(retActs, int(otherAct.ActId))
		}
	}
	case "order":{
		var orderActs []OrderAct
		err := Collection.Find(bson.M{"basicinfo.type":"order"}).All(&orderActs)

		if err!=nil{
			log.Println(err)
		}
		for _,orderAct := range orderActs{
			retActs = append(retActs, int(orderAct.ActId))
		}
	}
	case "takeout":{
		var takeoutActs []TakeoutAct
		err := Collection.Find(bson.M{"basicinfo.type":"takeout"}).All(&takeoutActs)
		if err!=nil{
			log.Println(err)
		}
		for _, takeoutAct := range takeoutActs {
			retActs = append(retActs, int(takeoutAct.ActId))
		}
	}
	default:{
		log.Println("Dao err: Error searchType")
		return nil,errors.New("error search type")
	}
	}
	return retActs,nil
}

func init(){
	session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")
	//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")
	if err != nil {
		log.Fatal(err)
	}
	/* Used to store id */
	IdCollection = session.DB("Jing").C("AutoId")
	Collection = session.DB("Jing").C("Activity")
	//objectId:=bson.ObjectIdHex("5d23f2a372df504ce4aa856a")
	fetchId := bson.M{}
	err = IdCollection.Find(nil).One(&fetchId)
	if err == mgo.ErrNotFound{
		//handler.Id = 0
		id := new(Id)
		id.AutoId = int32(0)
		id.Lock = false
		insertErr := IdCollection.Insert(id)
		if insertErr !=nil{
			log.Fatal(insertErr)
		}
	}else if err !=nil{
		log.Fatal("not mg")
		log.Fatal(err)
	}else {
		/* The fetchId["autoid"] can only be converted to int, not int32.*/
		/*
			intId := fetchId["autoid"].(int)
			handler.Id = int32(intId)
		*/
	}
}