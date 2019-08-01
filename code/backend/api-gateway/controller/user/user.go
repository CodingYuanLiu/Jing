package user

import "C"
import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"jing/app/api-gateway/cli/login"
	userClient "jing/app/api-gateway/cli/user"
	srv "jing/app/api-gateway/service"
	"jing/app/dao"
	"jing/app/jing"
	myjson "jing/app/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type Controller struct {
}

func (uc *Controller) FindAllUsers (c *gin.Context) {
	var retJson []map[string]interface{}
	users := dao.FindAllUsers()
	for _, user := range users {
		retJson = append(retJson, map[string]interface{} {
			"id": user.ID,
			"jaccount": user.Jaccount,
			"nickname": user.Nickname,
			"signature": user.Signature,
			"ban_time": user.BanTime,
		})
	}
	c.JSON(http.StatusOK, retJson)
}

func (uc *Controller) AdminQueryUser (c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'id' is not provided or bad"))
		return
	}
	rsp, err := userClient.CallQueryUser(int32(id), int32(id))
	if err != nil {
		jing.SendError(c, err)
	}
	c.JSON(http.StatusOK, map[string]interface {}{
		"id" : rsp.Id,
		"privacy": rsp.Privacy,
		"phone" : rsp.Phone,
		"nickname" : rsp.Nickname,
		"signature" : rsp.Signature,
		"birthday": rsp.Birthday,
		"major": rsp.Major,
		"gender": rsp.Gender,
		"dormitory": rsp.Dormitory,
		"jaccount": rsp.Jaccount,
	})
}

func (uc *Controller) BanUser (c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'id' is not provided or bad"))
		return
	}
	time, err := strconv.ParseInt(c.Query("time"), 10, 64)
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "param 'time' is not provided or bad"))
		return
	}
	isAdmin, err := dao.IsAdmin(id)
	if isAdmin {
		jing.SendError(c, jing.NewError(1, 400, "Can't ban an administrator"))
		return
	}
	err = dao.SetBanTime(id, time)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	c.JSON(http.StatusOK, map[string]string {
		"message": "Ban user successfully",
	})
}

func (uc *Controller) UnFollow (c *gin.Context) {
	userId := c.GetInt("userId")
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil || id == 0 {
		jing.SendError(c, jing.NewError(201, 400, "Param 'id' is not provided or bad"))
		return
	}
	dao.DeleteFollow(userId, id)
	c.JSON(http.StatusOK, map[string]string {
		"message": "Unfollow successfully",
	})
}

func (uc *Controller) Follow (c *gin.Context) {
	userId := c.GetInt("userId")
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil || id == 0 {
		jing.SendError(c, jing.NewError(201, 400, "Param 'id' is not provided or bad"))
		return
	}
	if id == userId {
		jing.SendError(c, jing.NewError(2, 400, "Can't follow yourself"))
		return
	}
	if dao.QueryFollow(userId, id) {
		jing.SendError(c, jing.NewError(3, 400, "You've followed this person"))
		return
	}
	dao.CreateFollow(userId, id)
	c.JSON(http.StatusOK, map[string]string {
		"message": "Follow successfully",
	})
}

func (uc *Controller) GetFollowers (c *gin.Context) {
	userId := c.GetInt("userId")
	followers := dao.GetFollower(userId)
	var jsons []map[string]interface{}
	for _, follower := range followers {
		resp, _ := userClient.CallQueryUser(int32(follower), -1)
		var j = map[string]interface{} {
			"id": resp.Id,
			"nickname": resp.Nickname,
			"avatar_url": resp.AvatarUrl,
			"signature": resp.Signature,
		}
		jsons = append(jsons, j)
	}
	c.JSON(http.StatusOK, jsons)
}

func (uc *Controller) GetFollowings (c *gin.Context) {
	userId := c.GetInt("userId")
	followings := dao.GetFollowing(userId)
	var jsons []map[string]interface{}
	for _, following := range followings {
		resp, _ := userClient.CallQueryUser(int32(following), -1)
		var j = map[string]interface{} {
			"id": resp.Id,
			"nickname": resp.Nickname,
			"avatar_url": resp.AvatarUrl,
			"signature": resp.Signature,
		}
		jsons = append(jsons, j)
	}
	c.JSON(http.StatusOK, jsons)
}

func (uc *Controller) GetFriends (c *gin.Context) {
	userId := c.GetInt("userId")
	friends := dao.GetFriends(userId)
	var jsons []map[string]interface{}
	for _, friend := range friends {
		resp, _ := userClient.CallQueryUser(int32(friend), -1)
		var j = map[string]interface{} {
			"id": resp.Id,
			"nickname": resp.Nickname,
			"avatar_url": resp.AvatarUrl,
			"signature": resp.Signature,
		}
		jsons = append(jsons, j)
	}
	c.JSON(http.StatusOK, jsons)
}

func (uc *Controller) Register (c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		jing.SendError(c, jing.NewError(101, 401, "Need Authorization field"))
		return
	}
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	err = json.Unmarshal(jsonStr, &jsonForm)

	if jsonForm["username"] == nil || jsonForm["password"] == nil || jsonForm["phone"] == nil || jsonForm["nickname"] == nil {
		jing.SendError(c, jing.NewError(202, 400, "Miss some field"))
		return
	}
	rsp, err := userClient.CallRegister(jsonForm["username"].(string), jsonForm["password"].(string), jsonForm["phone"].(string), jsonForm["nickname"].(string), jwt)
	if err != nil {
		jing.SendError(c, err)
		return
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Register ok",
		})
	}
}


func (uc *Controller) UploadAvatar (c *gin.Context) {
	userId := c.GetInt("userId")
	imageStr, _ := ioutil.ReadAll(c.Request.Body)
	base64 := string(imageStr[:])
	k, err := dao.GetAvatarKey(int(userId))
	if err != nil {
		jing.SendError(c, err)
		return
	}
	url := dao.ReplaceImg(base64, k)
	log.Println(url)
	key := url[strings.LastIndex(url, "/")+1:]
	err = dao.SetAvatarKey(int(userId), key)
	if err != nil {
		jing.SendError(c, err)
		return
	}
	c.JSON(http.StatusOK, map[string]string {
		"message": "Upload avatar successfully",
		"url": url,
	})
}


func (uc *Controller) UpdateUser (c *gin.Context) {

	id := c.GetInt("userId")

	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)

	if err != nil {
		jing.SendError(c, jing.NewError(203, 400, "JSON parse error"))
		return
	}

	if jsonForm["phone"] == nil {
		jsonForm["phone"] = ""
	}
	if jsonForm["signature"] == nil {
		jsonForm["signature"] = ""
	}
	if jsonForm["nickname"] == nil {
		jsonForm["nickname"] = ""
	}
	if jsonForm["gender"] == nil {
		jsonForm["gender"] = float64(-1)
	}
	if jsonForm["birthday"] == nil {
		jsonForm["birthday"] = ""
	}
	if jsonForm["dormitory"] == nil {
		jsonForm["dormitory"] = ""
	}
	if jsonForm["major"] == nil {
		jsonForm["major"] = ""
	}
	if jsonForm["privacy_level"] == nil {
		jsonForm["privacy_level"] = float64(-2)
	}

	rsp, err := userClient.CallUpdateUser(id, jsonForm)

	// All field update, rely on the frontend
	if err != nil {
		jing.SendError(c, err)
		return
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Update ok",
		})
	}
}

func (uc *Controller) GetOnlineUsers (c *gin.Context) {
	req, err := http.NewRequest("GET", "http://10.0.0.60:30257/plugins/restapi/v1/sessions", nil)
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
	var ret []map[string]interface{}
	var j map[string]interface{}
	_ = json.Unmarshal(jsonStr, &j)
	sessions := j["sessions"].([]interface{})
	for _, session := range sessions {
		username := session.(map[string]interface{})["username"].(string)
		user, _ := dao.FindUserByUsername(username)
		ret = append(ret, map[string]interface{} {
			"id": user.ID,
			"jaccount": user.Jaccount,
			"nickname": user.Nickname,
			"signature": user.Signature,
			"ban_time": user.BanTime,
		})
	}
	c.JSON(http.StatusOK, ret)
}

func (uc *Controller) QueryUser (c *gin.Context) {
	userId := -1
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if verified {
		rsp, err := login.CallAuth(jwt)
		if err == nil {
			userId = int(rsp.UserId)
		}
	}
	id := c.Query("id")
	intId, err := strconv.Atoi(id)
	if err != nil {
		jing.SendError(c, jing.NewError(201, 400, "Param 'id' is not provided or bad"))
		return
	}
	rsp, err := userClient.CallQueryUser(int32(intId), int32(userId))
	if err != nil {
		jing.SendError(c, err)
		return
	} else if rsp.Id > 0 {
		if rsp.Privacy == 0 || rsp.Privacy == 2 || rsp.SelfRequest {
			c.JSON(http.StatusOK, map[string]interface {}{
				"id" : rsp.Id,
				"privacy": rsp.Privacy,
				"phone" : rsp.Phone,
				"nickname" : rsp.Nickname,
				"signature" : rsp.Signature,
				"avatar_url": rsp.AvatarUrl,
				"birthday": rsp.Birthday,
				"major": rsp.Major,
				"gender": rsp.Gender,
				"dormitory": rsp.Dormitory,
			})
		} else {
			var message string
			if rsp.Privacy == 1 {
				message = "Only friend can access information"
			} else {
				message = "The user hide its information"
			}
			c.JSON(http.StatusOK, map[string]interface {}{
				"id": rsp.Id,
				"nickname": rsp.Nickname,
				"signature": rsp.Signature,
				"avatar_url": rsp.AvatarUrl,
				"privacy": rsp.Privacy,
				"message": message,
			})
		}
	}
}

