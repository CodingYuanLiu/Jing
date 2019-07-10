package handler

import (
	"gopkg.in/mgo.v2"
	"sync/atomic"
)

type ActivitySrv struct{
	Collection *mgo.Collection
}

var Id int32
func GetId() int32 {
	return atomic.AddInt32(&Id,1)
}