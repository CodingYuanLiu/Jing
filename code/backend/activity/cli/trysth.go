package main

import (
	//"bytes"
	//"context"
	"fmt"
	"time"

	//"jing/app/lib/auth/qbox"
	//"jing/app/lib/storage"
	"github.com/yanyiwu/gojieba"
	dao "jing/app/dao"
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


/*
func uploadFile() {
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

func testGoJieba(){
	s:="虹桥机场，虹桥火车站,浦东机场，早上去莘庄，去大悦城，去静安，去杨浦，去黄埔，去苏州，去颛桥，去颛桥龙胜万达看电影，周六上午10点出" +
		"租车，早上坐出租从徐汇校区到闵行校区出发，到东川路地铁站，到剑川路地铁站，到人民广场站，打滴滴到上海南站去,一起打车过去,"
	x:=gojieba.NewJieba()
	defer x.Free()
	tags,_ := dao.GetAllTags()
	for _,param := range tags{
		x.AddWord(param)
	}
	x.AddWord("滴滴")
	x.AddWord("打车")
	words := x.Cut(s,true)
	fmt.Println(words)

}

func main(){
	//testGoJieba()
	t1 := "2022-12-06 12:11:12"
	//t2 := time.Now().Format("2006-01-02 15:04:05")
	time1,_ := time.Parse("2006-01-02 15:04:05", t1)
	//time2,_ := time.Parse("2006-01-02 15:04:05", t2)
	time2 := time.Now()
	fmt.Println("t2:"+time2.String())
	if time1.Before(time2){
		fmt.Println("true")
	}
}