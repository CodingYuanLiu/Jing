package handler

import (
	"context"
	"gopkg.in/mgo.v2/bson"
	"jing/app/dao"
	feedback "jing/app/feedback/proto"
	"jing/app/jing"
)

func (feedbackSrv *FeedbackSrv) Comment(ctx context.Context,req *feedback.CmtReq,resp *feedback.CmtResp) error  {
	objectId := bson.ObjectIdHex(req.ObjectId)
	comment := dao.FeedbackComment{
		CommentatorId:	req.CommentatorId,
		CommentDesc:	req.CommentDesc,
		Time:			req.Time,
	}
	err := dao.FeedbackCollection.Update(
		bson.M{"_id":objectId},
		bson.M{"$push":bson.M{"fbcomments":comment}})
	if err != nil{
		return jing.NewError(300,400,"update comment error")
	}
	resp.Description = "Comment succeed"
	return nil
}
