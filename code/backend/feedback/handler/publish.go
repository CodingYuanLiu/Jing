package handler

import (
	"context"
	"fmt"
	"gopkg.in/mgo.v2/bson"
	"jing/app/dao"
	feedback "jing/app/feedback/proto"
	"jing/app/jing"
	"log"
	"strconv"
)

func (feedbackSrv *FeedbackSrv) Publish(ctx context.Context,req *feedback.PubReq,resp *feedback.PubResp) error  {
	objectId := bson.NewObjectId()
	userFeedback := dao.Feedback{
		Id:objectId,
		UserId:req.UserId,
		ActId:req.ActId,
		ReceiverId:req.ReceiverId,
		Communication:req.Communication,
		CommunicationDesc:req.CommunicationDesc,
		Punctuality:req.Punctuality,
		PunctualityDesc:req.PunctualityDesc,
		Honesty:req.Honesty,
		HonestyDesc:req.HonestyDesc,
		FbComments:[]dao.FeedbackComment{},
	}
	for i,image := range req.FbImages{
		name := fmt.Sprintf("feedbackImage/%s/img%s",objectId.Hex(),strconv.Itoa(i))
		imageUrl,err2 := dao.UploadImgWithName(image,name)
		if err2 != nil{
			return err2
		}
		userFeedback.FbImages = append(userFeedback.FbImages,imageUrl)
	}
	err := dao.FeedbackCollection.Insert(userFeedback)
	if err!=nil{
		log.Println(err)
		return jing.NewError(300,400,"fail to insert the feedback into mongoDB")
	}
	resp.ObjectId = objectId.Hex()
	resp.Description = "publish feedback succeed."
	return nil
}