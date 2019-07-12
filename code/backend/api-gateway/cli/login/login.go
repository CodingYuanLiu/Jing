package cli_login

import (
	"context"
	"fmt"
	loginProto "jing/app/login/proto/login"
	"log"
	"os"

	"github.com/micro/go-micro/client"
	"github.com/micro/go-plugins/client/grpc"
	"github.com/micro/go-plugins/registry/kubernetes"
)

var (
	LoginClient loginProto.LoginService
)

func init() {
	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)
	LoginClient = loginProto.NewLoginService("auth-service", client.DefaultClient)
}

func CallAuth(jwt string) (*loginProto.AuthResp, error) {
	resp, err := LoginClient.Auth(context.TODO(), &loginProto.AuthReq{
		Jwt: jwt,
	})
	if err != nil {
		// ...
	}
	return resp, nil
}

func CallLoginByJaccount(accessToken string) (*loginProto.TokenResp, error) {
	resp, err := LoginClient.LoginByJaccount(context.TODO(), &loginProto.LJReq{
		AccessToken: accessToken,
	})
	if err != nil {
		//...
	}
	return resp, nil
}

func CallLoginByUP(username string, password string) (*loginProto.TokenResp, error) {
	resp, err := LoginClient.LoginByUP(context.TODO(), &loginProto.UPReq{
		Username: username,
		Password: password,
	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetAccessToken(redirectUri string, code string) (*loginProto.AccessResp, error) {
	resp, err := LoginClient.GetAccessToken(context.TODO(), &loginProto.CodeReq{
		RedirectUri: redirectUri,
		Code:        code,
	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetWXOpenId(code string) (*loginProto.TokenResp, error) {
	resp, err := LoginClient.LoginByWx(context.TODO(), &loginProto.WxReq{
		Code: code,
	})
	if err != nil {
		// ...
	}
	return resp, err
}

func CallGetJac(code string, redirectUri string) (*loginProto.JaccResp, error) {
	resp, err := LoginClient.GetJaccount(context.TODO(), &loginProto.CodeReq{
		Code:        code,
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
	resp, err := LoginClient.BindJwtAndJaccount(context.TODO(), &loginProto.BindReq{
		Jwt:      jwt,
		Jaccount: jaccount,
	})

	if err != nil {
		log.Println(err)
	}
	return resp, err
}
