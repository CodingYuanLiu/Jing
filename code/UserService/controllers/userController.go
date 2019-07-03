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

type userInfo struct {
	Id int `json:"id"`
	Nickname string `json:"nickname"`
	Phone string `json:"phone"`
}

type userNew struct {
	Username string  	`json:"username"`
	Password string		`json:"password"`
	Nickname string		`json:"nickname"`
	Phone string		`json:"phone"`
}

func UpdateUser(ctx iris.Context) {
	u := &userInfo{}
	if err := ctx.ReadJSON(&u); err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.UpdateUser(iris.Map{
		"id":       u.Id,
		"nickname": u.Nickname,
		"phone":    u.Phone,
	}))
}

func InsertUser(ctx iris.Context) {
	n := &userNew{}
	if err := ctx.ReadJSON(&n); err != nil {
		fmt.Println(err)
		return
	}
	_, _ = ctx.JSON(models.InsertUser(iris.Map{
		"username": n.Username,
		"password": n.Password,
		"nickname": n.Nickname,
		"phone":   n.Phone,
	}))
}