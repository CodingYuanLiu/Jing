package dao

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

var FeedbackCollection *mgo.Collection

type Feedback struct{
	Id					bson.ObjectId	"_id"
	UserId				int32
	ReceiverId 			int32
	ActId				int32
	Communication 		int32	// Receiver's willing and patience to communicate.Can only be 1 to 5.
	CommunicationDesc 	string
	Punctuality 		int32 // Whether the receiver can handler the activity on time. Can only be 1 to 5
	PunctualityDesc 	string
	Honesty				int32 // Whether the receiver can be honest toward the activity?
	HonestyDesc			string
	FbComments			[]FeedbackComment
	FbImages			[]string
	Time 				string
}

type FeedbackComment struct{
	CommentatorId int32 // Can only be ReceiverId or UserId in the feedback identified by the FeedbackId
	CommentDesc	  string
	Time string
}

func init(){
	var err error
	//session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")
	session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")
	if err != nil {
		log.Fatal(err)
	}
	/* Used to store id */
	FeedbackCollection = session.DB("Jing").C("Feedback")
}
