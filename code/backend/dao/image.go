package dao

import (
	"bytes"
	"context"
	b64 "encoding/base64"
	"jing/app/jing"
	"jing/app/lib/auth/qbox"
	"jing/app/lib/storage"
	"log"
)

const domain = "image.jing855.cn"

func ReplaceImg(base64Img string, removeImg string) string {
	// Init access key and secret key
	accessKey := "XjJVXANFlU4XnSFgKmUdJWxx2GEzM_ftCVOvsorP"
	secretKey := "OrpJx83zmG6PPgV1e0D-j7wkhuykOxHB5-GdcENT"
	/* Auto generated key by qiniuyun, which is available in only 30 days.*/
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
	/* Auto generated key by qiniuyun, which is available in only 30 days.*/
	upToken := getUpToken()
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


func UploadImgWithName(base64Img string,name string) (string,error){
	// Init access key and secret key
	upToken := getUpToken()
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
	err := formUploader.Put(context.Background(), &ret, upToken,name,bytes.NewReader(data),dataLen,&putExtra)
	if err!=nil{
		log.Println(err)
		return "",jing.NewError(300,400,"Upload image to qiniu error")
	}
	url := "http://" + domain + "/"+ret.Key
	return url,nil
}

func getUpToken() string{
	// Init access key and secret key
	accessKey := "XjJVXANFlU4XnSFgKmUdJWxx2GEzM_ftCVOvsorP"
	secretKey := "OrpJx83zmG6PPgV1e0D-j7wkhuykOxHB5-GdcENT"
	/* Auto generated key by qiniuyun, which is available in only 30 days.*/
	bucket := "jing"
	mac := qbox.NewMac(accessKey, secretKey)
	putPolicy := storage.PutPolicy{
		Scope: bucket,
	}
	upToken := putPolicy.UploadToken(mac)
	return upToken
}

func DeleteImgWithName(name string) error {
	accessKey := "XjJVXANFlU4XnSFgKmUdJWxx2GEzM_ftCVOvsorP"
	secretKey := "OrpJx83zmG6PPgV1e0D-j7wkhuykOxHB5-GdcENT"
	/* Auto generated key by qiniuyun, which is available in only 30 days.*/
	bucket := "jing"
	mac := qbox.NewMac(accessKey, secretKey)
	cfg := storage.Config{}
	// 空间对应的机房
	cfg.Zone = &storage.ZoneHuadong
	// 是否使用https域名
	cfg.UseHTTPS = false
	// 上传是否使用CDN上传加速
	cfg.UseCdnDomains = false
	bucketManager := storage.NewBucketManager(mac, &cfg)
	err := bucketManager.Delete(bucket,name)
	if err != nil{
		log.Printf("Dao error: delete image %s from qiniu error.\n",name)
		log.Println(err)
		return err
	}
	log.Printf("Delete image %s from qiniu successfully\n",name)
	return nil
}