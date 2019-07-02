package routers

import (
	"quickstart/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/insert", &controllers.InsertController{})
	beego.Router("/find", &controllers.FindController{})
}
