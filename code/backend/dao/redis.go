package dao

import (
	"encoding/json"
	"fmt"
	//"github.com/gomodule/redigo/redis"
	"github.com/go-redis/redis"
	"log"
)

var (
	conn redis.Conn
	client *redis.ClusterClient
)

func SetRecommendationResultToRedis(userId int32, acts []int32) {
	recommendKey := fmt.Sprintf("Rec%d", userId)
	data, _ := json.Marshal(acts)
	err := client.Set(recommendKey, data, 300000000000).Err()
	//_, err := conn.Do("SET", recommendKey, data)
	if err != nil {
		log.Println(err)
	}
	//_, err = conn.Do("EXPIRE", recommendKey, 300)
	//if err != nil {
	//	log.Println(err)
	//	return
	//}

}

func GetRecommendationResultFromRedis(userId int32) []int32 {
	recommendKey := fmt.Sprintf("Rec%d", userId)

	//raw, err := redis.String(conn.Do("GET", recommendKey))
	raw, err := client.Get(recommendKey).Result()
	if err == redis.Nil {
		return nil
	} else if err != nil {
		log.Printf("Get result from redis error:%s", err.Error())
		return nil
	}

	var actIds []int32
	err = json.Unmarshal([]byte(raw), &actIds)
	if err != nil {
		log.Println(err)
	}

	if len(actIds) == 0 {
		log.Println("The length of actIds is 0")
		return nil
	}
	return actIds
}

func init() {
	var err error
	//conn, err = redis.Dial("tcp", "redis.database:6379")
	//if err != nil {
	//	log.Println("Connect to redis failed")
	//	return
	//}
	client = redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:     []string{"redis.database:79"},
		//Password: "", // no password set
		//DB:       0,  // use default DB
	})
	pong, err := client.Ping().Result()
	fmt.Println(pong, err)
}
