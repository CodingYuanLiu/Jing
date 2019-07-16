package main

import (
	"bytes"
	//"bytes"
	"context"
	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/storage"
	"fmt"
	"os"
)

var (
	//设置上传到的空间
	bucket = "jing"
)

//构造返回值字段
type PutRet struct {
	Hash    string `json:"hash"`
	Key     string `json:"key"`
}



func main() {
	//初始化AK，SK
	accessKey := "XjJVXANFlU4XnSFgKmUdJWxx2GEzM_ftCVOvsorP"
	secretKey := "OrpJx83zmG6PPgV1e0D-j7wkhuykOxHB5-GdcENT"
	mac := qbox.NewMac(accessKey, secretKey)
	putPolicy := storage.PutPolicy{
		Scope: bucket,
	}
	//key := "github-x.png"
	//localFile := "./testqiniu.png"
	upToken := putPolicy.UploadToken(mac)

	cfg := storage.Config{}
	// 空间对应的机房
	cfg.Zone = &storage.ZoneHuadong
	// 是否使用https域名
	cfg.UseHTTPS = true
	// 上传是否使用CDN上传加速
	cfg.UseCdnDomains = false
	// 构建表单上传的对象
	formUploader := storage.NewFormUploader(&cfg)
	ret := storage.PutRet{}

	putExtra := storage.PutExtra{
		Params: map[string]string{
			"x:name": "github logo",
		},
	}
	data,_ := file2Bytes("./testqiniu1.png")

	dataLen := int64(len(data))
	err := formUploader.PutWithoutKey(context.Background(), &ret, upToken,bytes.NewReader(data),dataLen,&putExtra)

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(ret.Key,ret.Hash)
	fmt.Println(ret)
}
/*
func file2Bytes(filename string) ([]byte, error) {

	// File
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// FileInfo:
	stats, err := file.Stat()
	if err != nil {
		return nil, err
	}

	// []byte
	data := make([]byte, stats.Size())
	count, err := file.Read(data)
	if err != nil {
		return nil, err
	}
	fmt.Printf("read file %s len: %d \n", filename, count)
	return data, nil
}*/