package controller_login

import "C"
import (
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"io/ioutil"
	loginClient "jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"log"
	"net/http"
	"os"
)

type LoginController struct {
}

type WXCode struct {
	Code string `json:"code" binding: required`
}

func (lc *LoginController) GetUserStatus (c *gin.Context) {
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


func (lc *LoginController) GetWXCode (c *gin.Context) {
	codeBody := new(WXCode)
	err := c.BindJSON(codeBody)
	if err != nil {
		log.Println(err)
		c.Abort()
		return
	}
	rsp, _ := loginClient.CallGetWXOpenId(codeBody.Code)

	if rsp.Status == 0 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Login success",
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
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Need update user info",
		})
	} else {
		c.JSON(http.StatusBadRequest, map[string]string {
			"message" : "Login failed",
		})
	}

}

func (lc *LoginController) BindJaccountAndWX(c *gin.Context) {
	code := c.Query("code")
	jwt := c.Query("jwt")
	jacRsp, _ := loginClient.CallGetJac(code, "https://sebastianj1wzyd.xyz/api/public/wx/redirect?jwt=" + jwt)

	jac := jacRsp.Jaccount

	bindRsp, _ := loginClient.CallBindJacAndWx(jwt, jac)

	if bindRsp.Status == 0 {
		file, _ := os.Open("../../template/bind_success.html")
		b, _ := ioutil.ReadAll(file)
		c.Data(http.StatusOK, "text/html;charset=UTF-8", b)
	} else if bindRsp.Status > 0 {
		c.JSON(http.StatusInternalServerError, map[string]string {
			"message" : "Bind error",
		})
	}
}




func (lc *LoginController) NativeLogin (c *gin.Context) {
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


