package controller_login

import (
	"github.com/gin-gonic/gin"
	loginClient "jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"net/http"
)

type LoginController struct {
}

func (lc *LoginController) GetUserStatus (c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")

	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "Need Authorization field",
		})
	}

	rsp, _:= loginClient.CallAuth(jwt)
	if rsp.Status == -2 || rsp.Status == -3{
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Invaild token",
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
/*
func (lc *LoginController) GetWXCode (c *gin.Context) {
	codeBody := new(authService.WXCode)
	err := c.BindJSON(codeBody)
	if err != nil {
		log.Println(err)
	}

	rsp := lc.AuthSrv.GetWXCodeSrv(codeBody.Code)

}
*/

func (lc *LoginController) NativeLogin (c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	verified := srv.VerifyUP(username, password)
	if !verified {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Username or password not found",
		})
	}
	rsp, _ := loginClient.CallLoginByUP(username, password)

	if rsp.Status == 1 {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "Bad credential",
		})
	} else if rsp.Status == 0 {
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


