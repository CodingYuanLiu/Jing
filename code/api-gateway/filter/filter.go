package filter

import (
	"github.com/gin-gonic/gin"
	authSrv "jing/app/api-gateway/service/auth-service"
	"log"
	"net/http"
	"strings"
)

func AuthFilter(c *gin.Context) {

	url := c.Request.URL

	log.Println(url.Path[:12])
	if strings.Compare(url.Path[:11], "/api/public") == 0 {
		c.Next()
	} else {
		auth := c.Request.Header.Get("Authorization")

		srv := new(authSrv.AuthService)
		if rsp := srv.Verify(auth); rsp != nil && rsp.Status == 0 {
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, map[string]string {
				"message" : "You don't have access to this page",
			})
			return
		}
	}
}

