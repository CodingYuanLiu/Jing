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
	mac := auth.New(accessKey, secretKey)

	cfg := storage.Config{
		// 是否使用https域名进行资源管理
		UseHTTPS: false,
	}
	// 指定空间所在的区域，如果不指定将自动探测
	// 如果没有特殊需求，默认不需要指定
	//cfg.Zone=&storage.ZoneHuabei
	bucketManager := storage.NewBucketManager(mac, &cfg)

	resURL := "http://devtools.qiniu.com/qiniu.png"
	// 指定保存的key
	fetchRet, err := bucketManager.Fetch(resURL, bucket, "qiniu.png")
	if err != nil {
		fmt.Println("fetch error,", err)
	} else {
		fmt.Println(fetchRet.String())
	}
	// 不指定保存的key，默认用文件hash作为文件名
	fetchRet, err = bucketManager.FetchWithoutKey(resURL, bucket)
	if err != nil {
		fmt.Println("fetch error,", err)
	} else {
		fmt.Println(fetchRet.String())
	}
}
