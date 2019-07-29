package login

import "C"
import (
	"encoding/base64"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"io/ioutil"
	loginClient "jing/app/api-gateway/cli/login"
	user "jing/app/api-gateway/cli/user"
	srv "jing/app/api-gateway/service"
	"jing/app/jing"
	myjson "jing/app/json"
	"log"
	"net/http"
)

type Controller struct {
}

type WXCode struct {
	Code string `json:"code" binding: required`
}

func (lc *Controller) GetUserStatus (c *gin.Context) {
	userId := c.GetInt("userId")
	resp, _ := user.CallQueryUser(int32(userId), int32(userId))
	jwt, err := loginClient.CallNewJwt(userId)
	if err != nil {
		jing.SendError(c, err)
	}
	c.JSON(http.StatusOK, map[string]interface {}{
		"message" : "You are online",
		"username": resp.Username,
		"jaccount": resp.Jaccount,
		"jwt_token": jwt,
		"password": resp.Password,
		"id": userId,
		"nickname": resp.Nickname,
		"signature": resp.Signature,
		"phone": resp.Phone,
		"avatar_url": resp.AvatarUrl,
		"birthday": resp.Birthday,
		"major": resp.Major,
		"gender": resp.Gender,
		"dormitory": resp.Dormitory,
		"privacy": resp.Privacy,
	})
}

func (lc *Controller) JaccountLogin (c *gin.Context) {
	jsonStr, err := ioutil.ReadAll(c.Request.Body)
	jsonForm := myjson.JSON{}
	_ = json.Unmarshal(jsonStr, &jsonForm)
	if err!=nil{
		c.JSON(http.StatusBadRequest,map[string] string{
			"message" : "JSON parse error",
		})
		c.Abort()
		return
	}
	code := jsonForm["code"]
	redirectUri := jsonForm["redirect_uri"]
	if code ==nil || redirectUri ==nil{
		c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Miss some field",
		})
		c.Abort()
		return
	}
	resp,err := loginClient.CallGetAccessToken(redirectUri.(string),code.(string))
	if err!=nil{
		c.JSON(http.StatusInternalServerError,map[string] string{
			"message": "GetAccessToken Error",
		})
		c.Abort()
		return
	}
	accessToken := resp.AccessToken
	resp2,err := loginClient.CallLoginByJaccount(accessToken)
	if err!=nil{
		log.Print("Get jwtToken by access token error")
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Get access token from Jaccount successfully",
		"jwt_token" : resp2.JwtToken,
		"status": resp2.Status,
	})
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
			"&scope=basic&redirect_uri=https://jing855.cn/api/public/wx/redirect?jwt=" + rsp.JwtToken

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
	jacRsp, _ := loginClient.CallGetJac(code, "https://jing855.cn/api/public/wx/redirect?jwt=" + jwt)

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
	rsp, err := loginClient.CallLoginByUP(username, password)
	if err != nil {
		jing.SendError(c, err)
	} else if rsp.Status == 0 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Login success",
			"jwt_token" : rsp.JwtToken,
		})
	}
}