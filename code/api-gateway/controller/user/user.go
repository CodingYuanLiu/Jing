package controller_user

import "C"
import (
	"github.com/gin-gonic/gin"
	userClient "jing/app/api-gateway/cli/user"
	"log"
	"net/http"
	"strconv"
)

type UserController struct {
}


type RegisterBody struct {
	Username string `json:"username" binding : "required"`
	Password string `json:"password" binding : "required"`
	Phone string `json:"phone" binding : "required"`
	Nickname string `json:"nickname" binding : "required"`
	Jaccount string `json:"jaccount" binding : "required"`
}

type UpdateBody struct {
	Id int `json:"id" binding: "required"`
	Phone string `json:"phone" binding: "optional"`
	Signature string `json:"signature" binding :"optional"`
	Nickname string `json: "nickname" binding: "optional"`
}


func (uc *UserController) Register (c *gin.Context) {
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
	rsp, _ := userClient.CallRegister(reqBody.Username, reqBody.Password,
			reqBody.Phone, reqBody.Nickname, reqBody.Jaccount)

	if rsp.Status == 400 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Bad request",
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Register ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	}
}


func (uc *UserController) UpdateUser (c *gin.Context) {

	updateBody := new (UpdateBody)
	if err := c.BindJSON(updateBody); err != nil {
		log.Println(err)
	}

	rsp, _ := userClient.CallUpdateUser(int32(updateBody.Id),
		updateBody.Nickname, updateBody.Phone, updateBody.Signature)


	// All field update, rely on the frontend
	if rsp.Status == 400 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Bad request",
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Update ok",
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	}
}

func (uc *UserController) QueryUser (c *gin.Context) {
	id := c.Param("id")
	intId, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string] string{
			"message" : "Bad request",
		})
	}
	rsp, err := userClient.CallQueryUser(int32(intId))
	if rsp.Id < 0 {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Bad request",
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

