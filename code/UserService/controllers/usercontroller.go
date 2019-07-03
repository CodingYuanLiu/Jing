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
	ctx.JSON(models.QueryUser(id))
}

type user_info struct {
	Id int `json:"id"`
	Nickname string `json:"nickname"`
	Phone string `json:"phone"`
}

func UpdateUser(ctx iris.Context) {
	u := &user_info{}
	if err := ctx.ReadJSON(&u); err != nil {
		fmt.Println(err)
		return
	}
	ctx.JSON(models.UpdateUser(iris.Map{
		"id": u.Id,
		"nickname": u.Nickname,
		"phone": u.Phone,
	}))
}