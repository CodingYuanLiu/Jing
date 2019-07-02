package controllers

import (
    "quickstart/models"
	"github.com/astaxie/beego"
)

type InsertController struct {
    beego.Controller
}

type FindController struct {
    beego.Controller
}

func (this *InsertController) Post() {
    key := this.GetString("key")
    value := this.GetString("value")
    if key == "" || value == "" {
        this.Ctx.WriteString("empty")
    } else {
        models.Insert(key, value)
        this.Ctx.WriteString("success")
    }
}

func (this *FindController) Get() {
    key := this.GetString("key")
    if key == "" {
        this.Ctx.WriteString("empty")
    } else {
        this.Data["json"] = models.Find(key)
        this.ServeJSON()
    }
}