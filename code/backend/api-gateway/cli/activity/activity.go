package activity

import (
	activityProto "jing/app/activity/proto"

	"github.com/micro/go-micro/client"
)

var (
	ActivityService activityProto.ActivitySrvService
)

func init() {
	ActivityService = activityProto.NewActivitySrvService("go-micro-srv-act", client.DefaultClient)
}
