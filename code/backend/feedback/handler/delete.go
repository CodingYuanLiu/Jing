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

func (feedbackSrv *FeedbackSrv) Delete(ctx context.Context,req *feedback.DltReq,resp *feedback.DltResp) error  {
	objectId := bson.ObjectIdHex(req.ObjectId)
	var userFeedback dao.Feedback
	err := dao.FeedbackCollection.Find(bson.M{"_id":objectId}).One(&userFeedback)
	if err != nil{
		log.Println(err)
		return jing.NewError(300,400,"cannot find the feedback when trying to delete it from mongoDB")
	}
	if req.UserId != userFeedback.UserId{
		log.Printf("request userid is %d but feedback userid is %d\n",req.UserId,userFeedback.UserId)
		return jing.NewError(104,403,"do not have the authority to delete the feedback")
	}

	imagesLen := len(userFeedback.FbImages)
	var err2 error
	for i:=0;i<imagesLen;i++{
		name := fmt.Sprintf("feedbackImage/%s/img%s",objectId.Hex(),strconv.Itoa(i))
		err = dao.DeleteImgWithName(name)
		if err != nil{
			log.Printf("Catch delete error from dao,cannot delete pictures for feedback")
			err2 = err //Save error result
			continue
		}
	}
	if err2 != nil{
		return jing.NewError(300,400,"cannot delete feedback pictures from qiniu")
	}
	log.Printf("Deleted pictures for feedback %s\n",objectId.Hex())

	err = dao.FeedbackCollection.Remove(bson.M{"_id":objectId})

	if err != nil{
		log.Println(err)
		return jing.NewError(300,400,"delete feedback from mongoDB err")
	}
	resp.Description = "Delete feedback succeed"
	return nil
}

