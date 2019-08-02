package dao

import "github.com/gomodule/redigo/redis"


func init(){
	conn,err := redis.Dial("tcp","localhost:6379")
	if err != nil{
		return
	}
}