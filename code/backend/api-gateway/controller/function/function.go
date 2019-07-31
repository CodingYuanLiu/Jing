package function

import (
	"github.com/gin-gonic/gin"
	"jing/app/dao"
	"net/http"
)

type Controller struct{}

func (functionController *Controller) TakeoutSearchShop(c *gin.Context) {
	key := c.Query("key")
	shops := dao.SearchShop(key)
	var jsons []map[string]string
	for _, v := range shops {
		jsons = append(jsons, map[string]string {
			"name": v.Name,
			"id": v.Sid,
		})
	}
	c.JSON(http.StatusOK, jsons)
}