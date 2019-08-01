package dao

import (
	"errors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/jing"
	"log"
	"time"
)
var Collection *mgo.Collection
var IdCollection *mgo.Collection
var BehaviorCollection *mgo.Collection

/*
	The struct stores different varieties of users' behaviors.
	E.g, UserBehavior.Taxi records user's action related to 'taxi'.
	In the array[5], each element stores the times that a user search
	the kind of activity, fetch details of the kind of activity,
	join an activity, publish an activity and the total number respectively.
*/
type UserBehavior struct{
	UserId int32
	Taxi [5]int32
	Takeout [5]int32
	Order [5]int32
	Other [5]int32
	Portrait [4]float64
}

type TotalBehavior struct{
	Id int32 //always -1
	Taxi int32
	Takeout int32
	Order int32
	Other int32
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
	MaxMember int32
	Status int32 // 0 for available, 1 for full members, 2 for expire, -1 for blocked
}

type TaxiInfo struct{
	DepartTime string
	Origin map[string]interface{}
	Destination map[string]interface{}
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
			Taxi: [5]int32{0,0,0,0,0},
			Takeout: [5]int32{0,0,0,0,0},
			Order: [5]int32{0,0,0,0,0},
			Other: [5]int32{0,0,0,0,0},
			Portrait:[4]float64{0,0,0,0},
		}
		err2 := BehaviorCollection.Insert(userBehavior)
		if err2 != nil {
			log.Println("Dao error: Insert new user behavior error")
			return jing.NewError(300,400,"Insert new user behavior error")
		}
	}else if err!=nil{
		log.Println("Dao error: fetch behavior error")
		return jing.NewError(300,400,"fetch behavior error")
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
		userBehavior.Taxi[4] = userBehavior.Taxi[4] + 1
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"taxi":userBehavior.Taxi}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return jing.NewError(300,400,"update behavior error")
		}
		err = BehaviorCollection.Update(bson.M{"id":-1},bson.M{"$inc":bson.M{"taxi":1}})
		if err != nil{
			log.Println("Dao error: update total behavior error")
			return jing.NewError(300,400,"update total behavior error")
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
		userBehavior.Takeout[4] = userBehavior.Takeout[4] + 1

		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"takeout":userBehavior.Takeout}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return jing.NewError(300,400,"update behavior error")
		}
		err = BehaviorCollection.Update(bson.M{"id":-1},bson.M{"$inc":bson.M{"takeout":1}})
		if err != nil{
			log.Println("Dao error: update total behavior error")
			return jing.NewError(300,400,"update total behavior error")
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
		userBehavior.Order[4] = userBehavior.Order[4] + 1
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"order":userBehavior.Order}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return jing.NewError(300,400,"update behavior error")
		}
		err = BehaviorCollection.Update(bson.M{"id":-1},bson.M{"$inc":bson.M{"order":1}})
		if err != nil{
			log.Println("Dao error: update total behavior error")
			return jing.NewError(300,400,"update total behavior error")
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
		userBehavior.Other[4] = userBehavior.Other[4] + 1
		err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"other":userBehavior.Other}})
		if err != nil{
			log.Println("Dao error: update behavior error")
			return jing.NewError(300,400,"update behavior error")
		}
		err = BehaviorCollection.Update(bson.M{"id":-1},bson.M{"$inc":bson.M{"other":1}})
		if err != nil{
			log.Println("Dao error: update total behavior error")
			return jing.NewError(300,400,"update total behavior error")
		}
	}

	/*
	TF-IDF algorithm means that every portrait is required to update when recorded a behavior.
	However, it costs a lot. So we only update the portrait of the behaving user, sacrificing the utility.
	*/
	var totalBehavior TotalBehavior
	err = BehaviorCollection.Find(bson.M{"id":int32(-1)}).One(&totalBehavior)
	if err != nil{
		log.Println("Dao error: fetch total behavior error.")
		log.Println(err)
		return jing.NewError(300,400,"fetch total behavior error")
	}

	portrait := CalculateWeight(userBehavior,totalBehavior)
	err = BehaviorCollection.Update(bson.M{"userid":userId},bson.M{"$set":bson.M{"portrait":portrait}})
	if err != nil{
		log.Println("Dao error: update portrait error")
		return jing.NewError(300,400,"update portrait error")
	}
	return nil
}

func CalculateWeight(userBehavior UserBehavior,totalBehavior TotalBehavior) (portrait [4]float64){
	/* The weight of the behavior ("search","scanning","join","publish") is (3,2,5,8) respectively */
	var tf float64
	var idf float64
	var tfIdf float64

	userTotal := userBehavior.Taxi[4] + userBehavior.Takeout[4] + userBehavior.Order[4] + userBehavior.Other[4]
	allTotal := totalBehavior.Taxi + totalBehavior.Takeout+ totalBehavior.Order + totalBehavior.Other

	/* Calculate taxi portrait*/
	if totalBehavior.Taxi != 0 {
		tf = float64(userTotal) / float64(totalBehavior.Taxi)
		idf = float64(allTotal)/float64(totalBehavior.Taxi)
		tfIdf = tf * idf
		portrait[0] = tfIdf * (float64(userBehavior.Taxi[0]) * 3 + float64(userBehavior.Taxi[1]) * 2 +
			float64(userBehavior.Taxi[2]) * 5 + float64(userBehavior.Taxi[3]) * 8)
	} else{
		portrait[0] = 0
	}

	/* Calculate takeout portrait*/
	if totalBehavior.Takeout != 0{
		tf = float64(userTotal) / float64(totalBehavior.Takeout)
		idf = float64(allTotal)/float64(totalBehavior.Takeout)
		tfIdf = tf * idf
		portrait[1] = tfIdf * (float64(userBehavior.Takeout[0]) * 3 + float64(userBehavior.Takeout[1]) * 2 +
			float64(userBehavior.Takeout[2]) * 5 + float64(userBehavior.Takeout[3]) * 8)
	} else{
		portrait[1] = 0
	}

	/* Calculate order portrait*/
	if totalBehavior.Order != 0 {
		tf = float64(userTotal) / float64(totalBehavior.Order)
		idf = float64(allTotal)/float64(totalBehavior.Order)
		tfIdf = tf * idf
		portrait[2] = tfIdf * (float64(userBehavior.Order[0]) * 3 + float64(userBehavior.Order[1]) * 2 +
			float64(userBehavior.Order[2]) * 5 + float64(userBehavior.Order[3]) * 8)
	}else{
		portrait[2] = 0
	}

	/* Calculate other portrait*/
	if totalBehavior.Other != 0{
		tf = float64(userTotal) / float64(totalBehavior.Takeout)
		idf = float64(allTotal)/float64(totalBehavior.Takeout)
		tfIdf = tf * idf
		portrait[3] = tfIdf * (float64(userBehavior.Other[0]) * 3 + float64(userBehavior.Other[1]) * 2 +
			float64(userBehavior.Other[2]) * 5 + float64(userBehavior.Other[3]) * 8)
	} else{
		portrait[3] = 0
	}
	return
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
				Taxi: [5]int32{0,0,0,0,0},
				Takeout: [5]int32{0,0,0,0,0},
				Order: [5]int32{0,0,0,0,0},
				Other: [5]int32{0,0,0,0,0},
				Portrait:[4]float64{0,0,0,0},
			})
			if err2 != nil{
				log.Println("Init user behavior collection error")
				log.Println(err2)
			}
		}
		/* Add total information*/
		err2 := BehaviorCollection.Insert(TotalBehavior{
			Id:-1,
			Taxi: 0,
			Takeout: 0,
			Order: 0,
			Other: 0,
		})
		if err2 != nil{
			log.Println("Init user behavior collection error")
			log.Println(err2)
		}
	}
}

/* 	If the activity is overdue (endTime < now), return status 2.
	Else, return status in the parameter
*/
func GetOverdueStatus(endTime string,status int32) int32{
	if status == 2{
		return 2
	}

	timeEnd,_ := time.Parse("2006-01-02 15:04:05",endTime)
	timeStr:=time.Now().Format("2006-01-02 15:04:05")
	timeNow,_ := time.Parse("2006-01-02 15:04:05",timeStr)

	if timeEnd.Before(timeNow){
		return 2
	}else{
		return status
	}
}

func GetMaxMemberStatus(actId int32,maxMember int32) int32{
	var count int
	var join  []Join
	db.Where("act_id=? and (is_admin=? or is_admin=?)",actId,1,0).Find(&join).Count(&count)
	if int32(count)>=maxMember{
		return 1
	} else{
		return 0
	}
}

func GetActivity(actId int32) (act map[string] interface{},err error){
	err = Collection.Find(bson.M{"actid": actId}).One(&act)
	if err == mgo.ErrNotFound{
		return act,jing.NewError(301,400,"can not find the activity in the mongoDB")
	} else if err != nil{
		return act,jing.NewError(302,400,"find activity in mongoDB error")
	} else{
		return act,err
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