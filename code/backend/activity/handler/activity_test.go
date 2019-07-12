package handler
import(
	"context"
	"github.com/stretchr/testify/assert"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	activity "jing/app/activity/proto"
	"log"
	"testing"
)
type id struct{
	AutoId int32
}

func Before() ActivitySrv{
	session, err := mgo.Dial("127.0.0.1:27017/")
	if err != nil {
		log.Fatal(err)
	}
	/* Used to store id */
	idCollection := session.DB("Jing").C("AutoIdTest")
	collection := session.DB("Jing").C("ActivityTest")
	_,err = collection.RemoveAll(nil)
	if err!=nil {
		log.Fatal(err)
	}
	_,err =idCollection.RemoveAll(nil)
	if err!=nil{
		log.Fatal(err)
	}
	actSrv := ActivitySrv{
		IdCollection:idCollection,
		Collection:collection,
	}
	fetchId := bson.M{}
	err = idCollection.Find(nil).One(&fetchId)
	if err == mgo.ErrNotFound{
		Id = 0
		id := new(id)
		id.AutoId = int32(0)
		insertErr := idCollection.Insert(id)
		if insertErr !=nil{
			log.Fatal(insertErr)
		}
	}else if err !=nil{
		log.Fatal(err)
	}else {
		/* The fetchId["autoid"] can only be converted to int, not int32.*/
		intId := fetchId["autoid"].(int)
		Id = int32(intId)
	}
	return actSrv
}
func TestActivitySrv_Taxi(t *testing.T) {
	a := assert.New(t)
	actSrv := Before()
	taxiPubReq := 	&activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"taxi",
			CreateTime:"2019.6.5",
			EndTime:"2019 7.6",
			Title:"To Big Joy City at 7.6 afternoon",
			Description:"Anothor description",
			Tag: []string{"Joy City","Taxi"},
		},
		TaxiInfo: &activity.TaxiInfo{
			DepartTime:  "2019-7-10 15:41:00",
			Origin:      "Minhang",
			Destination: "Xinzhuang",
		},
	}
	taxiPubResp := &activity.PubResp{}
	_ = actSrv.Publish(context.TODO(), taxiPubReq, taxiPubResp)
	a.Equal(int32(200), taxiPubResp.Status)
	a.Equal("OK", taxiPubResp.Description)
	a.Equal(int32(1), taxiPubResp.ActId)

	taxiQryReq := &activity.QryReq{
		ActId:1,
	}
	taxiQryResp := &activity.QryResp{}
	_ = actSrv.Query(context.TODO(),taxiQryReq,taxiQryResp)
	a.Equal(int32(200),taxiQryResp.Status)
	a.Equal("taxi",taxiQryResp.BasicInfo.Type)
	a.Equal("Minhang",taxiQryResp.TaxiInfo.Origin)
	a.Equal((*activity.OrderInfo)(nil),taxiQryResp.OrderInfo)

	taxiMdfReq:= &activity.MdfReq{
		ActId:1,
		CreateTime:"2015-7-7",
		EndTime:"2015-7-17",
		Description:"Modified description",
		Tag: []string{"Joy City","Taxi"},
		TaxiInfo: &activity.TaxiInfo{
			DepartTime:"2020-7-7 12:21:32",
			Origin:"ModifiedOrigin",
			Destination:"ModifiedDest",
		},
	}
	taxiMdfResp := &activity.MdfResp{}
	_ = actSrv.Modify(context.TODO(),taxiMdfReq,taxiMdfResp)
}

