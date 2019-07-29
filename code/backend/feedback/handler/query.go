package handler

import (
	"context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"jing/app/dao"
	feedback "jing/app/feedback/proto"
	"jing/app/jing"
)

func (feedbackSrv *FeedbackSrv) Query(ctx context.Context,req *feedback.QryReq,resp *feedback.QryResp) error  {
	receiverId := req.ReceiverId
	var userFeedbacks []dao.Feedback
	err := dao.FeedbackCollection.Find(bson.M{"receiverid":receiverId}).All(&userFeedbacks)
	if err == mgo.ErrNotFound{
		return jing.NewError(301,404,"cannot find the feedback in mongoDB")
	} else if err!=nil{
		return jing.NewError(300,400,"find feedback in mongoDB error")
	}
	for _,userFeedback := range userFeedbacks{
		respFeedback := &feedback.Feedback{
			UserId:				userFeedback.UserId,
			Id:					userFeedback.Id.Hex(),
			ActId:				userFeedback.ActId,
			ReceiverId:			userFeedback.ReceiverId,
			Communication:		userFeedback.Communication,
			CommunicationDesc:	userFeedback.CommunicationDesc,
			Punctuality:		userFeedback.Punctuality,
			PunctualityDesc:	userFeedback.PunctualityDesc,
			Honesty:			userFeedback.Honesty,
			HonestyDesc:		userFeedback.HonestyDesc,
			FbImages:			userFeedback.FbImages,
		}
		for _,comment := range userFeedback.FbComments{
			respFeedback.FbComment = append(respFeedback.FbComment,&feedback.FeedbackComment{
				CommentatorId:	comment.CommentatorId,
				CommentDesc:	comment.CommentDesc,
				Time:			comment.Time,
			})
		}
		resp.Feedbacks = append(resp.Feedbacks,respFeedback)
	}
	return nil
}
