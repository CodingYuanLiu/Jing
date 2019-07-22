package dao

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)
var Collection *mgo.Collection
var IdCollection *mgo.Collection

type Id struct{
	AutoId int32
	Lock bool
}

func init(){
	session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")
	//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()
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