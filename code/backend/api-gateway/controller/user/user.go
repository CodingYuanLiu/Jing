package user

import "C"
import (
	"encoding/json"
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

func (uc *Controller) ChangePrivacyLevel (c *gin.Context) {
	level, err := strconv.Atoi(c.Query("level"))
	if err != nil || level == 0 {
		jing.SendError(c, jing.NewError(201, 400, "param 'level' is not provided or bad"))
		return
	}
	userId := c.GetInt("userId")
	_ = dao.ChangePrivacyLevel(userId, level)
	c.JSON(http.StatusOK, map[string]string {
		"message": "update successfully",
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
		if rsp.Privacy == 0 || rsp.Privacy == 2 {
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

