package dao

import (
	"bytes"
	"context"
	b64 "encoding/base64"
	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/storage"
	"log"
)

func ReplaceImg(base64Img string, removeImg string) string {
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
	_ = storage.NewBucketManager(mac, &cfg).Delete(bucket, removeImg)

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

func UploadImg(base64Img string) string{
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