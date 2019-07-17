package user

import "C"
import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	userClient "jing/app/api-gateway/cli/user"
	myjson "jing/app/json"
	"log"
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

type UpdateBody struct {
	Id int `json:"id" binding:"required"`
	Phone string `json:"phone" binding:"optional"`
	Signature string `json:"signature" binding:"optional"`
	Nickname string `json:"nickname" binding:"optional"`
}


func (uc *Controller) Register (c *gin.Context) {
	// TODO: duplicate user
	reqBody := new(RegisterBody)
	err := c.ShouldBindJSON(reqBody)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, map[string]string{
			"message" : "Miss some field",
		})
		c.Abort()
		return
	}
	rsp, err := userClient.CallRegister(reqBody.Username, reqBody.Password,
			reqBody.Phone, reqBody.Nickname, reqBody.Jaccount)

	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : fmt.Sprintf("%s", err.Error()),
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Register ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : fmt.Sprintf("%s", err.Error()),
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
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : fmt.Sprintf("%s", err.Error()),
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Update ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : fmt.Sprintf("%s", err.Error()),
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
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : fmt.Sprintf("%s", err.Error()),
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
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Bad request",
		})
	}
}

