package login

import "C"
import (
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	loginClient "jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"log"
	"net/http"
)

type Controller struct {
}

type WXCode struct {
	Code string `json:"code" binding: required`
}

func (lc *Controller) GetUserStatus (c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")

	verified, jwt := srv.VerifyAuthorization(auth)
	if !verified {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "Need Authorization field",
		})
		c.Abort()
		return
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
			"id" : rsp.UserId,
		})
	} else {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Uncaught error",
		})
	}
}

func (lc *Controller) OAuthLogin (c *gin.Context) {

}

func (lc *Controller) OAuthRedirect (c *gin.Context) {

}


func (lc *Controller) GetWXCode (c *gin.Context) {
	codeBody := new(WXCode)
	err := c.BindJSON(codeBody)
	if err != nil {
		log.Println(err)
		c.Abort()
		return
	}
	rsp, _ := loginClient.CallGetWXOpenId(codeBody.Code)

	if rsp.Status == 0 {
		c.JSON(http.StatusOK, map[string]interface{} {
			"status": 0,
			"message": "Login success",
			"jwt": rsp.JwtToken,
		})
	} else if rsp.Status == 21 {

		url := "https://jaccount.sjtu.edu.cn/oauth2/authorize" +
			"?response_type=code&client_id=KIr40g1K90EObtNARwda" +
			"&scope=basic&redirect_uri=https://sebastianj1wzyd.xyz/api/public/wx/redirect?jwt=" + rsp.JwtToken

		var png []byte
		png, err := qrcode.Encode(url, qrcode.Medium, 256)
		if err != nil {
			log.Println(err)
		}
		str := base64.StdEncoding.EncodeToString(png)
		c.String(http.StatusMovedPermanently, str)
	} else if rsp.Status == 22 {
		c.JSON(http.StatusOK, map[string]interface{} {
			"message" : "Need update user info",
			"status": 22,
			"jwt": rsp.JwtToken,
		})
	} else {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Login failed",
		})
	}

}

func (lc *Controller) BindJaccountAndWX(c *gin.Context) {
	code := c.Query("code")
	jwt := c.Query("jwt")
	jacRsp, _ := loginClient.CallGetJac(code, "https://sebastianj1wzyd.xyz/api/public/wx/redirect?jwt=" + jwt)

	jac := jacRsp.Jaccount

	bindRsp, _ := loginClient.CallBindJacAndWx(jwt, jac)

	if bindRsp.Status == 0 {
		c.String(http.StatusOK, "<h1>已完成绑定，重新打开微信小程序即可使用即应的强大功能</h1>")
	} else if bindRsp.Status > 0 {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Bind error",
		})
	}
}




func (lc *Controller) NativeLogin (c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	verified := srv.VerifyUP(username, password)
	if !verified {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Username or password not found",
		})
		c.Abort()
		return
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


