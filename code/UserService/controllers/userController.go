package controllers

import (
	"github.com/kataras/iris"
)
import "strconv"
import "fmt"
import "../models"
import "../jaccount"

func JaccountLogin(ctx iris.Context) {
	ctx.Redirect(jaccount.GetRawLoginUrl("KIr40g1K90EObtNARwda", "basic", "https://sebastianj1wzyd.xyz/getuserinfo"))
}

func GetUserInfo(ctx iris.Context) {
	code := ctx.URLParam("code")
	accessToken := jaccount.GetAccessToken(code, "KIr40g1K90EObtNARwda", "16BA4A646213794CD6C72F32F219D37A4AE51345897AC889", "https://sebastianj1wzyd.xyz/print")
	_, _ = ctx.JSON(jaccount.GetProfile(accessToken))
}

func Print(ctx iris.Context) {
	n := iris.Map{}
	fmt.Println(ctx.String())
	ctx.ReadJSON(&n)
	fmt.Print(n)
}

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