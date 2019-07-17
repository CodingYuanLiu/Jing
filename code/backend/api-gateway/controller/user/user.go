package user

import "C"
import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	userClient "jing/app/api-gateway/cli/user"
	myjson "jing/app/json"
	"net/http"
	"strconv"
)

type Controller struct {
}


type RegisterBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Phone string `json:"phone" binding:"required"`
	Nickname string `json:"nickname" binding:"required"`
	Jaccount string `json:"jaccount" binding:"required"`
}

func (uc *Controller) Register (c *gin.Context) {
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	err = json.Unmarshal(jsonStr, &jsonForm)

	if jsonForm["username"] == nil || jsonForm["password"] == nil || jsonForm["phone"] == nil || jsonForm["nickname"] == nil || jsonForm["jwt"] == nil {
		c.JSON(http.StatusBadRequest, map[string]string{
			"message" : "Miss some field",
		})
		c.Abort()
		return
	}

	rsp, err := userClient.CallRegister(jsonForm["username"].(string), jsonForm["password"].(string), jsonForm["phone"].(string), jsonForm["nickname"].(string), jsonForm["jwt"].(string))

	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"message" : err,
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Register ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]interface{} {
			"message" : err,
		})
	}
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
			"message" : err,
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Update ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]interface{} {
			"message" : err,
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
			"message" : err,
		})
	} else if rsp.Id > 0 {
		c.JSON(http.StatusOK, map[string]interface {}{
			"id" : rsp.Id,
			"username" : rsp.Username,
			"jaccount" : rsp.Jaccount,
			"phone" : rsp.Phone,
			"nickname" : rsp.Nickname,
			"signature" : rsp.Signature,
		})
	} else {
		c.JSON(http.StatusBadRequest, map[string]interface{} {
			"message" : err,
		})
	}
}

