package handler

import (
	"gopkg.in/mgo.v2"
)

type ActivitySrv struct{
	Collection *mgo.Collection
	IdCollection *mgo.Collection
}
/*
var Id int32
func GetId() int32 {
	return atomic.AddInt32(&Id,1)
}
*/
type Id struct{
	AutoId int32
	Lock bool
}