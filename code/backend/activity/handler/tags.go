package handler

import (
	"context"
	"fmt"
	"github.com/yanyiwu/gojieba"
	activity "jing/app/activity/proto"
	"jing/app/dao"
	"log"
)

func (actSrv *ActivitySrv) GenTags(ctx context.Context,req *activity.TagReq,resp *activity.TagResp) error {

	//每次都从数据库里面把所有的tag取出来并加到jieba分词器里面。优点是如果tag词典有更新可以反映出来。
	// 缺点是，每次取数据和加词语的过程影响了性能。考虑到词典里面一共不超过100个词语，这样的性能折损可以接受。
	x:=gojieba.NewJieba("./dict/")
	defer x.Free()
	tags,err := dao.GetAllTags()
	if err!=nil{
		log.Println(err)
		resp.Status=500
		return err
	}
	for _,param := range tags{
		x.AddWord(param)
	}
	resource:= fmt.Sprintf("%s,%s",req.Title,req.Description)
	words := x.Cut(resource,true)
	log.Print("words:")
	log.Println(words)
	var results []string
	for _,tag := range tags{
		for _,word := range words{
			if word == tag{
				if !inList(results,word){
					results = append(results,word)
				}
			}
		}
	}
	log.Println("results:")
	log.Println(results)
	resp.Tag = results
	resp.Status = 200
	return nil
}

func inList(results []string,word string) bool{
	for _,result := range results{
		if result == word{
			return true
		}
	}
	return false
}

func (actSrv *ActivitySrv) AddTags(ctx context.Context,req *activity.AddTagsReq,resp *activity.AddTagsResp) error {
	tags := req.Tags
	var num int32
	num = 0
	for _,tag := range tags{
		if dao.IsInTagDict(tag) == true{
			continue
		}else{
			num += dao.InsertCandidateTag(tag,int(req.UserId))
		}
	}
	resp.Num = num
	return nil
}