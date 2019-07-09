package handler

import (
	"context"
	"jing/app/user/dao"
	"testing"
)
import "github.com/stretchr/testify/assert"
import login "jing/app/login/proto/login"

func TestLoginService_LoginByUP(t *testing.T) {
	a := assert.New(t)
	loginService := &LoginService{}
	loginReq := login.UPReq{
		Username: "dfy",
		Password: "hello",
	}
	loginResp := login.TokenResp{}
	_ = loginService.LoginByUP(context.TODO(), &loginReq, &loginResp)
	user := dao.User{
		ID: 4,
		Username: "dfy",
	}
	token := BuildToken(user)
	a.Equal(token, loginResp.JwtToken)
	a.Equal(int32(200), loginResp.Status)
	loginReq = login.UPReq{
		Username: "dfy",
		Password: "hell",
	}
	_ = loginService.LoginByUP(context.TODO(), &loginReq, &loginResp)
	a.Equal(int32(401), loginResp.Status)
}

func TestLoginService_Auth(t *testing.T) {
	a := assert.New(t)
	loginService := &LoginService{}
	loginReq := login.UPReq{
		Username: "dfy",
		Password: "hello",
	}
	loginResp := login.TokenResp{}
	_ = loginService.LoginByUP(context.TODO(), &loginReq, &loginResp)

	authReq := login.AuthReq{
		Jwt: loginResp.JwtToken,
	}
	authResp := login.AuthResp{}
	_ = loginService.Auth(context.TODO(), &authReq, &authResp)
	a.Equal(int32(0), authResp.Status)
	a.Equal("dfy", authResp.Username)
	a.Equal(int32(4), authResp.UserId)
	a.Equal(false, authResp.Admin)

	authReq.Jwt = ""
	_ = loginService.Auth(context.TODO(), &authReq, &authResp)
	a.Equal(int32(-3), authResp.Status)
	a.Equal("", authResp.Username)
	a.Equal(int32(-1), authResp.UserId)
}