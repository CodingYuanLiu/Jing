package login

import (
	"context"
	"fmt"
	"github.com/micro/go-micro/client"
	loginProto "jing/app/login/proto/login"
	"log"
)


var (
	Client loginProto.LoginService
)


func init() {
	Client = loginProto.NewLoginService("go.micro.handler.auth-service", client.DefaultClient)
}


func CallAuth(jwt string) (*loginProto.AuthResp, error) {
	resp, err := Client.Auth(context.TODO(), &loginProto.AuthReq{
		Jwt: jwt,
	})
	if err != nil {
		// ...
	}
	return resp, nil
}


func CallLoginByJaccount(accessToken string) (*loginProto.TokenResp, error) {
	resp, err := Client.LoginByJaccount(context.TODO(), &loginProto.LJReq{
		AccessToken: accessToken,
	})
	if err != nil {
		//...
	}
	return resp, nil
}


func CallLoginByUP(username string, password string) (*loginProto.TokenResp, error) {
	resp, err := Client.LoginByUP(context.TODO(), &loginProto.UPReq{
		Username:username,
		Password:password,

	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetAccessToken(redirectUri string, code string) (*loginProto.AccessResp, error) {
	resp, err := Client.GetAccessToken(context.TODO(), &loginProto.CodeReq{
		RedirectUri : redirectUri,
		Code : code,
	})
	if err != nil {
		// ...
	}

	return resp, err
}


func CallGetWXOpenId(code string) (*loginProto.TokenResp, error) {
	resp, err := Client.LoginByWx(context.TODO(), &loginProto.WxReq{
		Code:code,
	})
	if err != nil {
		// ...
	}
	return resp, err
}

func CallGetJac(code string, redirectUri string) (*loginProto.JaccResp, error) {
	resp, err := Client.GetJaccount(context.TODO(), &loginProto.CodeReq{
		Code : code,
		RedirectUri: redirectUri,
	})
	fmt.Println(code)
	fmt.Println(redirectUri)
	if err != nil {
		// ...
	}
	return resp, err
}

func CallBindJacAndWx(jwt string, jaccount string) (*loginProto.BindResp, error) {
	resp, err := Client.BindJwtAndJaccount(context.TODO(), &loginProto.BindReq{
		Jwt:jwt,
		Jaccount:jaccount,
	})

	if err != nil {
		log.Println(err)
	}
	return resp, err
}