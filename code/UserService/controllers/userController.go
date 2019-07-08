package controllers

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/kataras/iris"
)
import "fmt"
import "../models"
import "../jaccount"

func JaccountLogin(ctx iris.Context) {
	ctx.WriteString(jaccount.GetRawLoginUrl("KIr40g1K90EObtNARwda", "basic", "http://localhost:8081/blank"))
}

func GetUserInfo(ctx iris.Context) {
	code := ctx.URLParam("code")
	accessToken := jaccount.GetAccessToken(code, "KIr40g1K90EObtNARwda", "16BA4A646213794CD6C72F32F219D37A4AE51345897AC889", "http://localhost:8081/blank")
	_, _ = ctx.WriteString(accessToken)
}

func QueryUser(ctx iris.Context) {
	token, status, msg := ParseToken(ctx)
	if status != 0 {
		ctx.StatusCode(iris.StatusUnauthorized)
		_, _ = ctx.JSON(iris.Map{
			"msg": msg,
		})
		return
	}
	ctx.StatusCode(iris.StatusOK)
	claims := token.Claims.(jwt.MapClaims)
	id := int(claims["userId"].(float64))
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
	token, status, msg := ParseToken(ctx)
	if status != 0 {
		ctx.StatusCode(iris.StatusUnauthorized)
		_, _ = ctx.JSON(iris.Map{
			"msg": msg,
		})
		return
	}
	ctx.StatusCode(iris.StatusOK)
	claims := token.Claims.(jwt.MapClaims)
	id := int(claims["userId"].(float64))
	_, _ = ctx.JSON(models.UpdateUser(n, id))
}

func InsertUser(ctx iris.Context) {
	n := iris.Map{}
	if err := ctx.ReadJSON(&n); err != nil {
		fmt.Println(err)
		_, _ = ctx.JSON(iris.Map{
			"msg": "json is not correct",
		})
		return
	}
	var token interface{}
	if token = n["access_token"]; token == nil {
		ctx.StatusCode(iris.StatusBadRequest)
		_, _ = ctx.JSON(iris.Map{
			"msg": "need jaccount",
		})
		return
	}
	profile := jaccount.GetProfile(token.(string))
	e := int(profile["errno"].(float64))
	if e == 0 {
		n["jaccount"] = profile["entities"].([]interface {})[0].(map[string]interface {})["account"].(string)
	} else {
		ctx.StatusCode(iris.StatusBadRequest)
		_, _ = ctx.JSON(iris.Map{
			"msg": "auth_token is expired",
		})
		return
	}
	_, _ = ctx.JSON(models.InsertUser(n))
}