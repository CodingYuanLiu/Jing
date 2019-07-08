package handler_login

import (
	//cliLogin "jing/app/api-gateway/cli/login"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)



type Login struct {
}

func (l *Login) AuthHandler (c *gin.Context) {
	log.Println("Received Login.Auth API request")

	/**
	 * Authorization : Bearer jwt body
	 */
	auth := c.Request.Header.Get("Authorization")

	// No Authorization header found, not signed in, reject request
	if !strings.Contains(auth, "Bearer") {
		c.JSON(http.StatusUnauthorized, map[string]string {
			"message" : "You are signed out",
		})
		return
	}
	jwt := auth[7:]
	c.JSON(http.StatusOK, map[string]string {
		"Authorization" : auth,
		"jwt" : jwt,
	})

//	cliLogin.CallAuth(jwt)

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

	username := c.PostForm("username")
	password := c.PostForm("password")


	if strings.Compare(username, "") != 0|| strings.Compare(password, "") != 0 {
		c.JSON(http.StatusOK, map[string]string {
			"message" : "Username not exists Or Password not correct",
		})
	}

	//cliLogin.CallLoginByUP(username, password)
}