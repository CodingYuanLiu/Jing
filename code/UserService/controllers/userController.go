package controllers

import "github.com/kataras/iris"
import "strconv"
import "fmt"
import "../models"

func QueryUser(ctx iris.Context) {
	s_id := ctx.URLParam("id")
	id, err := strconv.Atoi(s_id)
	if err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.QueryUser(id))
}

func Login(ctx iris.Context) {
	n := iris.Map{}
	if err := ctx.ReadJSON(&n); err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.Login(n))
}


func UpdateUser(ctx iris.Context) {
	n := iris.Map{}
	if err := ctx.ReadJSON(&n); err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.UpdateUser(n))
}

func InsertUser(ctx iris.Context) {
	n := iris.Map{}
	if err := ctx.ReadJSON(&n); err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.InsertUser(n))
}