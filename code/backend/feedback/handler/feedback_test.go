package handler

import (
	"context"
	"github.com/stretchr/testify/assert"
	feedback "jing/app/feedback/proto"
	"jing/app/jing"
	"testing"
)

func TestFeedbackSrv(t *testing.T) {
	a := assert.New(t)
	feedbackSrv := FeedbackSrv{}

	/* Test publishing feedback srv */
	publishReq := &feedback.PubReq{
		UserId: 10,
		ReceiverId:3,
		ActId: 10,
		Communication:4,
		CommunicationDesc:"communication desc",
		Punctuality:4,
		PunctualityDesc: "punctuality desc",
		Honesty: 5,
		HonestyDesc: "honesty desc",
		FbImages:	[]string{"123","324123123563543"},
	}
	pubResp := &feedback.PubResp{}
	err := feedbackSrv.Publish(context.TODO(),publishReq,pubResp)
	a.Equal(nil,err)
	a.Equal("publish feedback succeed.",pubResp.Description)
	objectId := pubResp.ObjectId


	/* Test commenting srv and query srv */
	qryReq := &feedback.QryReq{
		ReceiverId:3,
	}
	qryResp := &feedback.QryResp{}
	err = feedbackSrv.Query(context.TODO(),qryReq,qryResp)
	a.Equal(nil,err)


	qryReq = &feedback.QryReq{
		ReceiverId:30,
	}
	qryResp = &feedback.QryResp{}
	err = feedbackSrv.Query(context.TODO(),qryReq,qryResp)
	a.Equal(jing.NewError(301,404,"cannot find the feedback in mongoDB"),err)

	cmtReq := &feedback.CmtReq{
		ObjectId:objectId,
	}
	cmtResp := &feedback.CmtResp{}
	err = feedbackSrv.Comment(context.TODO(),cmtReq,cmtResp)
	a.Equal("Comment succeed",cmtResp.Description)


	/* Test deleting feedback srv*/
	deleteReq := &feedback.DltReq{
		ObjectId:objectId,
		UserId:1,
	}
	deleteResp := &feedback.DltResp{}
	err = feedbackSrv.Delete(context.TODO(),deleteReq,deleteResp)
	a.Equal("",deleteResp.Description)

	deleteReq = &feedback.DltReq{
		ObjectId:objectId,
		UserId:10,
	}
	deleteResp = &feedback.DltResp{}
	err = feedbackSrv.Delete(context.TODO(),deleteReq,deleteResp)
	a.Equal("Delete feedback succeed",deleteResp.Description)

	deleteReq = &feedback.DltReq{
		ObjectId:objectId,
		UserId:10,
	}
	deleteResp = &feedback.DltResp{}
	err = feedbackSrv.Delete(context.TODO(),deleteReq,deleteResp)
	a.Equal("",deleteResp.Description)
}