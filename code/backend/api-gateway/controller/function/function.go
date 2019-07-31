package function

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"jing/app/dao"
	"jing/app/jing"
	"net/http"
)

type Controller struct{}

func (functionController *Controller) TakeoutSearchShop(c *gin.Context) {
	key := c.Query("key")
	shops := dao.SearchShop(key)
	var jsons []map[string]string
	for _, v := range shops {
		jsons = append(jsons, map[string]string {
			"name": v.Name,
			"id": v.Sid,
		})
	}
	c.JSON(http.StatusOK, jsons)
}

func (functionController *Controller) GetStatistics(c *gin.Context) {
	var users, onlineUsers, acts, availableActs int
	req, err := http.NewRequest("GET", "http://202.120.40.8:30257/plugins/restapi/v1/sessions", nil)
	if err != nil {
		fmt.Println(err)
		jing.SendError(c, jing.NewError(1, 500, "Can't create http request"))
		return
	}
	req.Header.Add("Authorization", "lqynb")
	req.Header.Add("Accept", "application/json")
	cli := &http.Client{}
	resp, err := cli.Do(req)
	if err != nil {
		fmt.Println(err)
		jing.SendError(c, jing.NewError(1, 500, "Openfire server are unavailable"))
		return
	}
	jsonStr, _ := ioutil.ReadAll(resp.Body)
	var j map[string]interface{}
	_ = json.Unmarshal(jsonStr, &j)
	sessions := j["sessions"].([]interface{})
	onlineUsers = len(sessions)
	users = len(dao.FindAllUsers())
	var results []map[string]interface{}
	_ = dao.Collection.Find(bson.M{"basicinfo.status":int32(0)}).All(&results)
	availableActs = len(results)
	acts = len(dao.GetAllActId())
	c.JSON(http.StatusOK, map[string]int {
		"users": users,
		"online_users": onlineUsers,
		"acts": acts,
		"available_acts": availableActs,
	})
}