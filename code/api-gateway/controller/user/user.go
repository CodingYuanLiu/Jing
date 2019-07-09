package controller_user

import "C"
import (
	"github.com/gin-gonic/gin"
	userService "jing/app/api-gateway/service/user-service"
	"log"
	"net/http"
)

type UserController struct {
	UserSrv *userService.UserService
}

func (uc *UserController) Register (c *gin.Context) {
	reqBody := new(userService.RegisterBody)
	err := c.ShouldBindJSON(reqBody)
	// tips := make(map[string]interface{})
	if err != nil {
		for e := range err.Error()  {
			log.Println(e)
		}
	}
	rsp := uc.UserSrv.RegisterSrv(reqBody)

	if rsp == nil {
		// ...
	} else if rsp.Status == 400 {
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
	updateBody := new (userService.UpdateBody)
	if err := c.BindJSON(updateBody); err != nil {
		log.Println(err)
	}

	log.Println("in controller : ", updateBody.Phone)
	log.Println("in controller : ", updateBody.Signature)
	log.Println("in controller : ", updateBody.Nickname)
	rsp := uc.UserSrv.UpdateUserSrv(updateBody)

	if rsp == nil {
		// ...
	} else if rsp.Status == 400 {
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
	rsp := uc.UserSrv.QueryUserSrv(id)
	if rsp == nil {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	} else if rsp.Id < 0 {
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

