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
	auth := c.Request.Header.Get("Authorization")
	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Need Authorization field",
		})
		c.Abort()
		return
	}
	resp, _ := login.CallAuth(jwt)
	if resp.UserId == -1 {
		c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Invalid jwt",
		})
		c.Abort()
		return
	}
	imageStr, _ := ioutil.ReadAll(c.Request.Body)
	base64 := string(imageStr[:])
	url := dao.ReplaceImg(base64, dao.GetAvatarKey(int(resp.UserId)))
	log.Println(url)
	key := url[strings.LastIndex(url, "/")+1:]
	dao.SetAvatarKey(int(resp.UserId), key)
	c.JSON(http.StatusOK, map[string]string {
		"message": "Upload avatar successfully",
	})
}


func (uc *Controller) UpdateUser (c *gin.Context) {

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

	if jsonForm["id"] == nil {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message": "Missing field id",
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

	rsp, err := userClient.CallUpdateUser(int32(jsonForm["id"].(float64)),
		jsonForm["phone"].(string), jsonForm["signature"].(string), jsonForm["nickname"].(string))

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
	id := c.Query("id")
	intId, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string] string{
			"message" : "Param id is not correct",
		})
	}
	rsp, err := userClient.CallQueryUser(int32(intId))
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	} else if rsp.Id > 0 {
		c.JSON(http.StatusOK, map[string]interface {}{
			"id" : rsp.Id,
			"username" : rsp.Username,
			"jaccount" : rsp.Jaccount,
			"phone" : rsp.Phone,
			"nickname" : rsp.Nickname,
			"signature" : rsp.Signature,
			"avatar_url": rsp.AvatarUrl,
		})
	} else {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"error": err,
		})
	}
}

