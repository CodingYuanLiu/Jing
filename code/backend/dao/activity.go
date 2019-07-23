package dao

import (
	"errors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)
var Collection *mgo.Collection
var IdCollection *mgo.Collection
var BehaviorCollection *mgo.Collection

/*
	The struct stores different varieties of users' behaviors.
	E.g, UserBehavior.Taxi records user's action related to 'taxi'.
	In the array[4], each element stores the times that a user search
	the kind of activity, fetch details of the kind of activity,
	join an activity and publish an activity respectively.
*/
type UserBehavior struct{
	UserId int32
	Taxi [4]int32
	Takeout [4]int32
	Order [4]int32
	Other [4]int32
}


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

func AddBehavior(behavior string, userId int,type_ string) error{
	InitBehaviorCollection()
	var userBehavior UserBehavior
	err := BehaviorCollection.Find(bson.M{"userid":userId}).One(&userBehavior)
	if err == mgo.ErrNotFound{
		log.Printf("Dao: Insert behavior for a new user:%d",userId)
		userBehavior = UserBehavior{
			UserId:int32(userId),
			Taxi: [4]int32{0,0,0,0},
			Takeout: [4]int32{0,0,0,0},
			Order: [4]int32{0,0,0,0},
			Other: [4]int32{0,0,0,0},
		}
		err2 := BehaviorCollection.Insert(userBehavior)
		if err2 !=nil {
			log.Println("Dao error: Insert new user behavior error")
			log.Println(err2)
			return err2
		}
	}else if err!=nil{
		log.Println("Dao error: fetch behavior error")
		return err
	}
	switch type_{
	case "taxi":
		switch behavior{
		case "search":
			userBehavior.Taxi[0] = userBehavior.Taxi[0] + 1
		case "scanning":
			userBehavior.Taxi[1] = userBehavior.Taxi[1] + 1
		case "join":
			userBehavior.Taxi[2] = userBehavior.Taxi[2] + 1
		case "publish":
			userBehavior.Taxi[3] = userBehavior.Taxi[3] + 1
		}
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"taxi":userBehavior.Taxi}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return err
		}
	case "takeout":
		switch behavior{
		case "search":
			userBehavior.Takeout[0] = userBehavior.Takeout[0] + 1
		case "scanning":
			userBehavior.Takeout[1] = userBehavior.Takeout[1] + 1
		case "join":
			userBehavior.Takeout[2] = userBehavior.Takeout[2] + 1
		case "publish":
			userBehavior.Takeout[3] = userBehavior.Takeout[3] + 1
		}
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"takeout":userBehavior.Takeout}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return err
		}
	case "order":
		switch behavior{
		case "search":
			userBehavior.Order[0] = userBehavior.Order[0] + 1
		case "scanning":
			userBehavior.Order[1] = userBehavior.Order[1] + 1
		case "join":
			userBehavior.Order[2] = userBehavior.Order[2] + 1
		case "publish":
			userBehavior.Order[3] = userBehavior.Order[3] + 1
		}
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"order":userBehavior.Order}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return err
		}
	case "other":
		switch behavior{
		case "search":
			userBehavior.Other[0] = userBehavior.Other[0] + 1
		case "scanning":
			userBehavior.Other[1] = userBehavior.Other[1] + 1
		case "join":
			userBehavior.Other[2] = userBehavior.Other[2] + 1
		case "publish":
			userBehavior.Other[3] = userBehavior.Other[3] + 1
		}
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"other":userBehavior.Other}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return err
		}
	}
	return nil
}

func InitBehaviorCollection(){
	/* Check if the collection is empty, initialize it.*/
	fetchBehavior := bson.M{}
	err := BehaviorCollection.Find(nil).One(&fetchBehavior)
	if err == mgo.ErrNotFound{
		ids := GetAllUserId()
		for _,userId := range ids{
			err2 := BehaviorCollection.Insert(UserBehavior{
				UserId:int32(userId),
				Taxi: [4]int32{0,0,0,0},
				Takeout: [4]int32{0,0,0,0},
				Order: [4]int32{0,0,0,0},
				Other: [4]int32{0,0,0,0},
			})
			if err2 != nil{
				log.Println("Init user behavior collection error")
				log.Println(err2)
			}
		}
	}
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
	BehaviorCollection = session.DB("Jing").C("UserBehavior")

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