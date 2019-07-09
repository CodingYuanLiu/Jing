package controller_login

import (
	"github.com/gin-gonic/gin"
	authService "jing/app/api-gateway/service/auth-service"
	"log"
	"net/http"
)

type LoginController struct {
	AuthSrv *authService.AuthService
}

func (lc *LoginController) GetUserStatus (c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")

	rsp := lc.AuthSrv.Verify(auth)

	if rsp == nil {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Service down",
		})
	} else if rsp.Status == -2 {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	} else if rsp.Status == -1 {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "Account expired",
		})
	} else if rsp.Status == 0{
		c.JSON(http.StatusOK, map[string]interface {}{
			"message" : "You are online",
			"username" : rsp.Username,
			"id" : rsp.UserId,
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	}
}

func (lc *LoginController) OAuthLogin (c *gin.Context) {

}

func (lc *LoginController) OAuthRedirect (c *gin.Context) {

}

func (lc *LoginController) NativeLogin (c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	log.Println(username, password)
	rsp := lc.AuthSrv.LoginByUP(username, password)
	log.Println(rsp)
	if rsp == nil {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	} else if rsp.Status == 401 {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "Bad credential",
		})
	} else if rsp.Status == 200 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Login success",
			"jwt_token" : rsp.JwtToken,
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	}
}


