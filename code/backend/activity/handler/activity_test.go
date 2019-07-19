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
		id := new(Id)
		id.AutoId = int32(0)
		id.Lock = false
		insertErr := idCollection.Insert(id)
		if insertErr !=nil{
			log.Fatal(insertErr)
		}
	}else if err !=nil{
		log.Fatal(err)
	}else {
		/* The fetchId["autoid"] can only be converted to int, not int32.*/
		/*
		intId := fetchId["autoid"].(int)
		Id = int32(intId)
		*/
	}

	return actSrv
}
func TestActivitySrv_TaxiAndComment(t *testing.T) {
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

	//Test comment part
	cmtResp := &activity.CmtResp{}
	_ = actSrv.Comment(context.TODO(), &activity.CmtReq{
		ActId:1,
		UserId:1,
		ReceiverId:2,
		Time: "2019-10-13 12:32:21",
		Content:"Second Comment",
	},cmtResp)
	a.Equal(int32(200),cmtResp.Status)
	a.Equal("OK",cmtResp.Description)

	_ = actSrv.Comment(context.TODO(), &activity.CmtReq{
		ActId:2,
		UserId:1,
		ReceiverId:2,
		Time: "2019-10-13 12:32:21",
		Content:"Second Comment",
	},cmtResp)
	a.Equal(int32(404),cmtResp.Status)
	a.Equal("Not Found",cmtResp.Description)

	//Test query part
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
	a.Equal(int32(200),taxiMdfResp.Status)
	a.Equal("OK",taxiMdfResp.Description)

	taxiDltReq := &activity.DltReq{
		ActId:1,
	}
	taxiDltResp := &activity.DltResp{}
	_ = actSrv.Delete(context.TODO(),taxiDltReq,taxiDltResp)
	a.Equal(int32(200),taxiDltResp.Status)
	a.Equal("OK",taxiDltResp.Description)

}

func TestActivitySrv_Takeout(t *testing.T) {
	a := assert.New(t)
	actSrv := Before()
	takeoutPubReq := 	&activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"takeout",
			CreateTime:"2020-6-5",
			EndTime:"2020-7-6",
			Title:"BK in the noon",
			Description:"Takeout description",
			Tag: []string{"KFC","Element"},
		},
		TakeoutInfo: &activity.TakeoutInfo{
			OrderTime:"2019-7-10 15:41:00",
			Store:"BK",
		},
	}
	takeoutPubResp := &activity.PubResp{}
	_ = actSrv.Publish(context.TODO(), takeoutPubReq, takeoutPubResp)
	a.Equal(int32(200), takeoutPubResp.Status)
	a.Equal("OK", takeoutPubResp.Description)
	a.Equal(int32(1), takeoutPubResp.ActId)

	takeoutQryReq := &activity.QryReq{
		ActId:1,
	}
	takeoutQryResp := &activity.QryResp{}
	_ = actSrv.Query(context.TODO(), takeoutQryReq,takeoutQryResp)
	a.Equal(int32(200),takeoutQryResp.Status)
	a.Equal("takeout",takeoutQryResp.BasicInfo.Type)
	a.Equal("BK",takeoutQryResp.TakeoutInfo.Store)
	a.Equal((*activity.TaxiInfo)(nil),takeoutQryResp.TaxiInfo)

	takeoutMdfReq := &activity.MdfReq{
		ActId:1,
		CreateTime:"2075-7-7",
		EndTime:"2075-7-17",
		Description:"Modified takeout description",
		Tag: []string{"BurgerKing","Element"},
		TakeoutInfo:&activity.TakeoutInfo{
			Store:"Burger King",
			OrderTime:"2077-7-7",
		},
	}
	takeoutMdfResp := &activity.MdfResp{}
	_ = actSrv.Modify(context.TODO(), takeoutMdfReq, takeoutMdfResp)
	a.Equal(int32(200), takeoutMdfResp.Status)
	a.Equal("OK", takeoutMdfResp.Description)

	takeoutDltReq := &activity.DltReq{
		ActId:1,
	}
	takeoutDltResp := &activity.DltResp{}
	_ = actSrv.Delete(context.TODO(),takeoutDltReq, takeoutDltResp)
	a.Equal(int32(200), takeoutDltResp.Status)
	a.Equal("OK", takeoutDltResp.Description)

}

func TestActivitySrv_Order(t *testing.T) {
	a := assert.New(t)
	actSrv := Before()
	orderPubReq := 	&activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"order",
			CreateTime:"2020-10-5",
			EndTime:"2020-12-6",
			Title:"Dior lipstick",
			Description:"description",
			Tag: []string{"Dior","Lipstick"},
		},
		OrderInfo: &activity.OrderInfo{
			Store:"Dior",
		},
	}
	orderPubResp := &activity.PubResp{}
	_ = actSrv.Publish(context.TODO(), orderPubReq, orderPubResp)
	a.Equal(int32(200), orderPubResp.Status)
	a.Equal("OK", orderPubResp.Description)
	a.Equal(int32(1), orderPubResp.ActId)

	orderQryReq := &activity.QryReq{
		ActId:1,
	}
	orderQryResp := &activity.QryResp{}
	_ = actSrv.Query(context.TODO(), orderQryReq, orderQryResp)
	a.Equal(int32(200), orderQryResp.Status)
	a.Equal("order", orderQryResp.BasicInfo.Type)
	a.Equal("Dior", orderQryResp.OrderInfo.Store)
	a.Equal((*activity.TaxiInfo)(nil), orderQryResp.TaxiInfo)

	orderMdfReq := &activity.MdfReq{
		ActId:1,
		CreateTime:"2015-7-7",
		EndTime:"2015-7-17",
		Description:"Modified order description",
		Tag: []string{"Dior","Taobao"},
		OrderInfo:&activity.OrderInfo{
			Store:"Taobao Dior",
		},
	}
	orderMdfResp := &activity.MdfResp{}
	_ = actSrv.Modify(context.TODO(), orderMdfReq, orderMdfResp)
	a.Equal(int32(200), orderMdfResp.Status)
	a.Equal("OK", orderMdfResp.Description)

	orderDltReq := &activity.DltReq{
		ActId:1,
	}
	orderDltResp := &activity.DltResp{}
	_ = actSrv.Delete(context.TODO(),orderDltReq, orderDltResp)
	a.Equal(int32(200), orderDltResp.Status)
	a.Equal("OK", orderDltResp.Description)
}

func TestActivitySrv_Other(t *testing.T) {
	a := assert.New(t)
	actSrv := Before()
	otherPubReq := 	&activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"other",
			CreateTime:"2022-10-5",
			EndTime:"2022-12-6",
			Title:"Basketball this afternoon",
			Description:"description",
			Tag: []string{"Basketball"},
		},
		OtherInfo: &activity.OtherInfo{
			ActivityTime:"2022-11-11 11:11:21",
		},
	}
	otherPubResp := &activity.PubResp{}
	_ = actSrv.Publish(context.TODO(), otherPubReq, otherPubResp)
	a.Equal(int32(200), otherPubResp.Status)
	a.Equal("OK", otherPubResp.Description)
	a.Equal(int32(1), otherPubResp.ActId)

	otherQryReq := &activity.QryReq{
		ActId:1,
	}
	otherQryResp := &activity.QryResp{}
	_ = actSrv.Query(context.TODO(), otherQryReq, otherQryResp)
	a.Equal(int32(200), otherQryResp.Status)
	a.Equal("other", otherQryResp.BasicInfo.Type)
	a.Equal("2022-11-11 11:11:21", otherQryResp.OtherInfo.ActivityTime)
	a.Equal((*activity.TaxiInfo)(nil), otherQryResp.TaxiInfo)

	otherMdfReq := &activity.MdfReq{
		ActId:1,
		CreateTime:"2025-7-7",
		EndTime:"2025-7-17",
		Description:"Modified other description",
		Tag: []string{"FootBall"},
		OtherInfo:&activity.OtherInfo{
			ActivityTime:"2025-11-11",
		},
	}
	otherMdfResp := &activity.MdfResp{}
	_ = actSrv.Modify(context.TODO(), otherMdfReq, otherMdfResp)
	a.Equal(int32(200), otherMdfResp.Status)
	a.Equal("OK", otherMdfResp.Description)

	otherDltReq := &activity.DltReq{
		ActId:1,
	}
	otherDltResp := &activity.DltResp{}
	_ = actSrv.Delete(context.TODO(), otherDltReq, otherDltResp)
	a.Equal(int32(200), otherDltResp.Status)
	a.Equal("OK", otherDltResp.Description)
}

func TestActivitySrv_NotFound(t *testing.T) {
	a := assert.New(t)
	actSrv := Before()
	notFoundPubReq := 	&activity.PubReq{
		Info: &activity.BasicInfo{
			Type:"undefined type",
			CreateTime:"2022-10-5",
			EndTime:"2022-12-6",
			Title:"Basketball this afternoon",
			Description:"description",
			Tag: []string{"Basketball"},
		},
		OtherInfo: &activity.OtherInfo{
			ActivityTime:"2022-11-11 11:11:21",
		},
	}
	notFoundPubResp := &activity.PubResp{}
	_ = actSrv.Publish(context.TODO(), notFoundPubReq, notFoundPubResp)
	a.Equal(int32(500), notFoundPubResp.Status)
	a.Equal("Undefined Type", notFoundPubResp.Description)
	a.Equal(int32(-1), notFoundPubResp.ActId)

	notFoundQryReq := &activity.QryReq{
		ActId:1,
	}
	notFoundQryResp := &activity.QryResp{}
	_ = actSrv.Query(context.TODO(), notFoundQryReq, notFoundQryResp)
	a.Equal(int32(404), notFoundQryResp.Status)
	a.Equal((*activity.BasicInfo)(nil),notFoundQryResp.BasicInfo)
	a.Equal((*activity.TaxiInfo)(nil), notFoundQryResp.TaxiInfo)

	notFoundMdfReq := &activity.MdfReq{
		ActId:1,
		CreateTime:"2025-7-7",
		EndTime:"2025-7-17",
		Description:"Modified other description",
		Tag: []string{"FootBall"},
		OtherInfo:&activity.OtherInfo{
			ActivityTime:"2025-11-11",
		},
	}
	notFoundMdfResp := &activity.MdfResp{}
	_ = actSrv.Modify(context.TODO(), notFoundMdfReq, notFoundMdfResp)
	a.Equal(int32(404), notFoundMdfResp.Status)
	a.Equal("Not Found", notFoundMdfResp.Description)

	notFoundDltReq := &activity.DltReq{
		ActId:1,
	}
	notFoundDltResp := &activity.DltResp{}
	_ = actSrv.Delete(context.TODO(), notFoundDltReq, notFoundDltResp)
	a.Equal(int32(404), notFoundDltResp.Status)
	a.Equal("Not Found", notFoundDltResp.Description)
}