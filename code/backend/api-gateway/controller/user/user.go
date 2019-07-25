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
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": 0,
			"message": "level is not provided or bad",
		})
		c.Abort()
		return
	}
	userId := c.GetInt("userId")
	_ = dao.ChangePrivacyLevel(userId, level)
	c.JSON(http.StatusOK, map[string]string {
		"message": "update successfully",
	})
}

func (uc *Controller) Follow (c *gin.Context) {
	userId := c.GetInt("userId")
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": 0,
			"message": "id is not provided or bad",
		})
		c.Abort()
		return
	}
	if id == userId {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": 1,
			"message": "Can't follow yourself",
		})
		c.Abort()
		return
	}
	if dao.QueryFollow(userId, id) {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": 2,
			"message": "You've followed this person",
		})
		c.Abort()
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
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	err = json.Unmarshal(jsonStr, &jsonForm)

	if jsonForm["username"] == nil || jsonForm["password"] == nil || jsonForm["phone"] == nil || jsonForm["nickname"] == nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message" : "Miss some field",
		})
		c.Abort()
		return
	}

	rsp, err := userClient.CallRegister(jsonForm["username"].(string), jsonForm["password"].(string), jsonForm["phone"].(string), jsonForm["nickname"].(string), jwt)

	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Register ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]interface{} {
			"error": err,
		})
	}
}


func (uc *Controller) UploadAvatar (c *gin.Context) {
	userId := c.GetInt("userId")
	imageStr, _ := ioutil.ReadAll(c.Request.Body)
	base64 := string(imageStr[:])
	url := dao.ReplaceImg(base64, dao.GetAvatarKey(int(userId)))
	log.Println(url)
	key := url[strings.LastIndex(url, "/")+1:]
	dao.SetAvatarKey(int(userId), key)
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
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "incorrect json format",
		})
		c.Abort()
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
		jsonForm["gender"] = -1
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
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Update ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]interface{} {
			"error": err,
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
		c.JSON(http.StatusBadRequest, map[string] string{
			"message" : "Param id is not correct",
		})
		c.Abort()
		return
	}
	rsp, err := userClient.CallQueryUser(int32(intId), int32(userId))
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
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
	} else {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	}
}

