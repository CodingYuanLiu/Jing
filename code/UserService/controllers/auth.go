package controllers

import (
	"../jaccount"
	"github.com/dgrijalva/jwt-go"
	"github.com/jameskeane/bcrypt"
	"github.com/kataras/iris"
	"time"
)
import "../models"

func UserLogin(ctx iris.Context) {
	m := iris.Map{}
	if err := ctx.ReadForm(&m); err != nil {
		ctx.StatusCode(iris.StatusBadRequest)
		_, _ = ctx.JSON(iris.Map{
			"msg": "form is wrong",
		})
	} else {
		var password string
		var username string
		var _id int
		var _password string
		var jaccountAuth = false
		if m["access_token"] != nil {
			accessToken := m["access_token"].(string)
			profile := jaccount.GetProfile(accessToken)
			e := int(profile["errno"].(float64))
			if e == 0 {
				j := profile["entities"].([]interface {})[0].(map[string]interface {})["account"].(string)
				if _id = models.QueryId(j); _id == -1 {
					ctx.StatusCode(iris.StatusUnauthorized)
					_, _ = ctx.JSON(iris.Map{
						"msg": "need register",
					})
					return
				}
				jaccountAuth = true
			}
		} else {
			username := m["username"].(string)
			password = m["password"].(string)
			_id, _password = models.QueryIdAndPassword(username)
		}
		if bcrypt.Match(password, _password) || jaccountAuth {
			claims := make(jwt.MapClaims)
			claims["username"] = username
			claims["userId"] = _id
			claims["admin"] = "false"
			claims["exp"] = time.Now().Add(time.Hour).Unix()
			claims["iat"] = time.Now().Unix()
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
			tokenString, _ := token.SignedString([]byte("lqynb"))
			ctx.StatusCode(iris.StatusOK)
			ctx.SetCookieKV("Jingjwt", tokenString)
			_, _ = ctx.JSON(iris.Map{
				"msg": "Login success",
			})
		} else {
			ctx.StatusCode(iris.StatusUnauthorized)
			_, _ = ctx.JSON(iris.Map{
				"msg": "Bad credentials",
			})
		}
	}
}

/*
 * status:
 * 0: OK
 * 1: No token
 * 2: Error token
 * 3: Expired
 */
func ParseToken(ctx iris.Context) (t *jwt.Token, status int, msg string) {
	tokenString := ctx.GetCookie("Jingjwt")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("lqynb"), nil
	})
	if token == nil {
		return nil, -1, "No token"
	}
	if err != nil {
		return nil, -2, "Error token"
	}
	if !token.Valid {
		return nil, -3, "Expired token"
	}
	return token, 0, "OK"
}