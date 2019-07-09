package handler_login

import (
	"github.com/gin-gonic/gin"
	cliLogin "jing/app/api-gateway/cli/login"
	protoLogin "jing/app/api-gateway/proto/login"
	"log"
	"net/http"
	"strings"
)



type AuthService struct {
}

func (srv *AuthService) Verify (auth string) *protoLogin.AuthResp {
	// Authorization : Bearer jwt code field
	jwt := auth[7:]

	// Call service
	rsp, err := cliLogin.CallAuth(jwt)

	if err != nil {
		return nil
	}
	return rsp
}


func (srv *AuthService) LoginByJaccountHandler (c *gin.Context) {
	log.Println("Received Login.Jaccount API request")
	c.JSON(http.StatusOK, map[string]string {
		"message" : "Hi, you've succeeded in connecting these all",
	})
}

func (srv *AuthService) LoginByUP(username string, password string) *protoLogin.TokenResp {

	if strings.Compare(username, "") == 0|| strings.Compare(password, "") == 0 {
		return nil
	}

	rsp, err := cliLogin.CallLoginByUP(username, password)

	if err != nil {
		return nil
	}

	return rsp
}