package main

import (
	"fmt"
	"os"

	"jing/app/lib/auth"
	"jing/app/lib/storage"
)

var (
	accessKey = os.Getenv("QINIU_ACCESS_KEY")
	secretKey = os.Getenv("QINIU_SECRET_KEY")
	bucket    = os.Getenv("QINIU_TEST_BUCKET")
)

func main() {
	cfg := storage.Config{}
	mac := auth.New(accessKey, secretKey)
	bucketManger := storage.NewBucketManager(mac, &cfg)
	siteURL := "http://devtools.qiniu.com"

	// 设置镜像存储
	err := bucketManger.SetImage(siteURL, bucket)
	if err != nil {
		fmt.Println(err)
	}

	// 取消设置镜像存储
	err = bucketManger.UnsetImage(bucket)
	if err != nil {
		fmt.Println(err)
	}

}
