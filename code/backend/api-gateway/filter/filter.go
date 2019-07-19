package filter

import (
	"github.com/gin-gonic/gin"
	loginClient "jing/app/api-gateway/cli/login"
	srv "jing/app/api-gateway/service"
	"net/http"
	"strings"
)

func AuthFilter(c *gin.Context) {

	url := c.Request.URL

	if strings.Compare(url.Path[:11], "/api/public") == 0 {
		c.Next()
		return
	} else {
		auth := c.Request.Header.Get("Authorization")

		verified, jwt := srv.VerifyAuthorization(auth)

		if !verified {
			c.JSON(http.StatusUnauthorized, map[string]string {
				"message" : "You need login to do this",
			})
			c.Abort()
			return
		}

		if rsp, _ := loginClient.CallAuth(jwt); rsp.Status == 0 {
			c.Set("userId", int(rsp.UserId))
			c.Next()
			return
		} else {
			c.JSON(http.StatusUnauthorized, map[string]string {
				"message" : "You need login to do this",
			})
			c.Abort()
			return
		}
	}
}

