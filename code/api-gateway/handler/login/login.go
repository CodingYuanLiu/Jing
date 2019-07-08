package handler_login

import (
	//cliLogin "../../cli/login"
	//protoLogin "../../proto/login"
	//"context"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)



type Login struct {
}

func (l *Login) AuthHandler (c *gin.Context) {
	log.Println("Received Login.Auth API request")
	c.JSON(http.StatusOK, map[string]string {
		"message" : "Hi, you've succeeded in connecting these all",
	})

/*	cliLogin.LoginClient.Auth(context.TODO(), &protoLogin.AuthReq{

	})
*/
}


func (l *Login) LoginByJaccountHandler (c *gin.Context) {
	log.Println("Received Login.Jaccount API request")
	c.JSON(http.StatusOK, map[string]string {
		"message" : "Hi, you've succeeded in connecting these all",
	})
}

func (l *Login) LoginByUPHanler(c *gin.Context) {
	log.Println("Received Login.UP API request")
	c.JSON(http.StatusOK, map[string]string {
		"message" : "Hi, you've succeeded in connecting these all",
	})
}