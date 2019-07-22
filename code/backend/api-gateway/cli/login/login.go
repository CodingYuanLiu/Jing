package login

import (
	"context"
	"github.com/micro/go-micro/client"
	"github.com/micro/go-plugins/client/grpc"
	"github.com/micro/go-plugins/registry/kubernetes"
	loginProto "jing/app/login/proto/login"
	"log"
	"os"
)

var (
	Client loginProto.LoginService
)

func init() {
	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)

	Client = loginProto.NewLoginService("auth-service", client.DefaultClient)
}

func CallNewJwt(userId int) (string, error) {
	resp, err := Client.NewJwt(context.TODO(), &loginProto.JwtReq{
		UserId: int32(userId),
	})
	if err != nil {
		return "", nil
	}
	return resp.JwtToken, nil
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
		return resp, err
	}
	return resp, nil
}

func CallLoginByUP(username string, password string) (*loginProto.TokenResp, error) {
	resp, err := Client.LoginByUP(context.TODO(), &loginProto.UPReq{
		Username: username,
		Password: password,
	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetAccessToken(redirectUri string, code string) (*loginProto.AccessResp, error) {
	resp, err := Client.GetAccessToken(context.TODO(), &loginProto.CodeReq{
		RedirectUri: redirectUri,
		Code:        code,
	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetWXOpenId(code string) (*loginProto.TokenResp, error) {
	resp, err := Client.LoginByWx(context.TODO(), &loginProto.WxReq{
		Code: code,
	})
	if err != nil {
		// ...
	}
	return resp, err
}

func CallGetJac(code string, redirectUri string) (*loginProto.JaccResp, error) {
	resp, err := Client.GetJaccount(context.TODO(), &loginProto.CodeReq{
		Code:        code,
		RedirectUri: redirectUri,
	})
	if err != nil {
		// ...
	}
	return resp, err
}

func CallBindJacAndWx(jwt string, jaccount string) (*loginProto.BindResp, error) {
	resp, err := Client.BindJwtAndJaccount(context.TODO(), &loginProto.BindReq{
		Jwt:      jwt,
		Jaccount: jaccount,
	})

	if err != nil {
		log.Println(err)
	}
	return resp, err
}
