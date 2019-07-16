package handler

import (
	"bytes"
	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/storage"
	"jing/app/activity/model"
	activity "jing/app/activity/proto"
	"context"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	b64 "encoding/base64"
	"log"
)

func (actSrv *ActivitySrv) Publish(ctx context.Context,req *activity.PubReq,resp *activity.PubResp) error {
	//fmt.Println(req)
	id := insert(req, actSrv.Collection, actSrv.IdCollection)
	if id == -1{
		resp.Status = 500
		resp.Description = "Undefined Type"
		resp.ActId = -1
		return nil
	}
	resp.Status = 200
	resp.Description = "OK"
	resp.ActId = id
	return nil
}

func insert(req *activity.PubReq,collection *mgo.Collection,idCollection *mgo.Collection) int32 {
	var id int32
	basicInfo := model.BasicInfo{
		//Actid:id,
		Type:req.Info.Type,
		CreateTime:req.Info.CreateTime,
		EndTime:req.Info.EndTime,
		Title:req.Info.Title,
		Description:req.Info.Description,
		Tag:req.Info.Tag,
		//Store the images into the mongoDB. Discard it now.
		//Images:req.Info.Images,
	}
	/* Upload the pictures and return the url */
	for _,param := range req.Info.Images{
		basicInfo.Images = append(basicInfo.Images,uploadImg(param))
	}
	var err error
	switch basicInfo.Type{
	case "taxi":
		id = GetId()
		newAct := model.TaxiAct{
			ActId:     id,
			BasicInfo: basicInfo,
			TaxiInfo: model.TaxiInfo{
				DepartTime:req.TaxiInfo.DepartTime,
				Origin:req.TaxiInfo.Origin,
				Destination:req.TaxiInfo.Destination,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "takeout":
		id = GetId()
		newAct := model.TakeoutAct{
			ActId:      id,
			BasicInfo: basicInfo,
			TakeoutInfo:model.TakeoutInfo{
				Store:req.TakeoutInfo.Store,
				OrderTime:req.TakeoutInfo.OrderTime,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "order":
		id = GetId()
		newAct := model.OrderAct{
			ActId: id,
			BasicInfo:basicInfo,
			OrderInfo:model.OrderInfo{
				Store:req.OrderInfo.Store,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	case "other":
		id = GetId()
		newAct := model.OtherAct{
			ActId: id,
			BasicInfo:basicInfo,
			OtherInfo:model.OtherInfo{
				ActivityTime:req.OtherInfo.ActivityTime,
			},
		Comments: []model.Comment{},
		}
		err = collection.Insert(newAct)
	default:
		fmt.Println("Undefined Type.")
		return -1
	}
	if err!=nil{
		fmt.Println("Insert Fail!")
	}
	err = idCollection.Update(
		bson.M{"autoid": id-1},
		bson.M{"$inc": bson.M{ "autoid": 1 }})
	if err!=nil{
		log.Fatal(err)
	}
	return id
}

func uploadImg(base64Img string) string{
	// Init access key and secret key
	accessKey := "XjJVXANFlU4XnSFgKmUdJWxx2GEzM_ftCVOvsorP"
	secretKey := "OrpJx83zmG6PPgV1e0D-j7wkhuykOxHB5-GdcENT"
	/* Auto generated key by qiniuyun, which is available in only 30 days.*/
	domain := "puo7ltwok.bkt.clouddn.com"
	bucket := "jing"
	mac := qbox.NewMac(accessKey, secretKey)
	putPolicy := storage.PutPolicy{
		Scope: bucket,
	}
	upToken := putPolicy.UploadToken(mac)
	cfg := storage.Config{}
	// 空间对应的机房
	cfg.Zone = &storage.ZoneHuadong
	// 是否使用https域名
	cfg.UseHTTPS = false
	// 上传是否使用CDN上传加速
	cfg.UseCdnDomains = false
	// 构建表单上传的对象
	formUploader := storage.NewFormUploader(&cfg)

	putExtra := storage.PutExtra{
		Params: map[string]string{
			"x:name": "github logo",
		},
	}
	data,_ := b64.StdEncoding.DecodeString(base64Img)
	dataLen := int64(len(data))

	ret := storage.PutRet{}
	err := formUploader.PutWithoutKey(context.Background(), &ret, upToken,bytes.NewReader(data),dataLen,&putExtra)
	if err!=nil{
		log.Fatal(err)
	}
	url := "http://" + domain + "/"+ret.Key
	return url
}