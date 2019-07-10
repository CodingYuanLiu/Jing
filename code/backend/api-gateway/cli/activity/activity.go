package activity

import (
	"context"
	"github.com/micro/go-micro/client"
	activityProto "jing/app/activity/proto"
)

var (
	ActivityService activityProto.ActivitySrvService
)

func init()  {
	ActivityService = activityProto.NewActivitySrvService("go.micro.handler.act", client.DefaultClient)
}