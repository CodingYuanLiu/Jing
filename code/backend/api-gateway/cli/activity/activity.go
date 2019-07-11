package activity

import (
	"context"
	"errors"
	"github.com/micro/go-micro/client"
	activityProto "jing/app/activity/proto"
	"jing/app/api-gateway/controller/activity"
	"jing/app/user/dao"
)

var (
	Client activityProto.ActivitySrvService
)

func init()  {
	Client = activityProto.NewActivitySrvService("go.micro.handler.act", client.DefaultClient)
}

func QueryActivity(actId int) (*activityProto.QryResp, error) {
	qryReq := activityProto.QryReq{
		ActId: int32(actId),
	}
	resp, err := Client.Query(context.TODO(), &qryReq)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func DeleteActivity(userId int, actId int) error {
	dltReq := activityProto.DltReq{
		ActId: int32(actId),
	}
	resp, _ := Client.Delete(context.TODO(), &dltReq)
	if resp.Status != 200 {
		return errors.New("can not modify")
	}
	return nil
}

func ModifyActivity(userId int, act activity.ModifyActivity) error {
	actType := act.Type
	mdfReq := activityProto.MdfReq{
		ActId:       int32(act.ActId),
		CreateTime:  act.CreateTime,
		EndTime:     act.EndTime,
		Description: act.Description,
		Tag:         act.Tag,
	}
	if actType == "takeout" {
		mdfReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: act.Store,
			OrderTime: act.OrderTime,
		}
	} else if actType == "taxi" {
		mdfReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: act.DepartTime,
			Origin: act.Origin,
			Destination: act.Destination,
		}
	} else if actType == "order" {
		mdfReq.OrderInfo = &activityProto.OrderInfo{
			Store: act.Store,
		}
	} else if actType == "other" {
		mdfReq.OtherInfo = &activityProto.OtherInfo{
			ActivityTime: act.ActivityTime,
		}
	}
	resp2, err := Client.Modify(context.TODO(), &mdfReq)
	if err != nil {
		return err
	}
	if resp2.Status != 200 {
		return errors.New("can not modify")
	}
	return nil
}

func PublishActivity(userId int, act activity.Activity) error {
	actType := act.Type
	pubReq := activityProto.PubReq{
		Info: &activityProto.BasicInfo{
			Type:        act.Type,
			CreateTime:  act.CreateTime,
			EndTime:     act.EndTime,
			Title:       act.Title,
			Description: act.Description,
			Tag:         act.Tag,
		},
	}
	if actType == "takeout" {
		pubReq.TakeoutInfo = &activityProto.TakeoutInfo{
			Store: act.Store,
			OrderTime: act.OrderTime,
		}
	} else if actType == "taxi" {
		pubReq.TaxiInfo = &activityProto.TaxiInfo{
			DepartTime: act.DepartTime,
			Origin: act.Origin,
			Destination: act.Destination,
		}
	} else if actType == "order" {
		pubReq.OrderInfo = &activityProto.OrderInfo{
			Store: act.Store,
		}
	} else if actType == "other" {
		pubReq.OtherInfo = &activityProto.OtherInfo{
			ActivityTime: act.ActivityTime,
		}
	}
	resp2, err := Client.Publish(context.TODO(), &pubReq)
	if err != nil {
		return err
	}
	if resp2.Status != 200 {
		return errors.New("can not publish")
	}
	_ = dao.PublishActivity(userId, int(resp2.ActId))
	return nil
}