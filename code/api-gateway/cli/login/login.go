package cli_login

import (
	"context"
	"github.com/micro/go-micro/client"
	loginProto "jing/app/api-gateway/proto/login"
)


var (
	LoginClient loginProto.LoginService
)


func init() {
	LoginClient = loginProto.NewLoginService("go.micro.srv.auth-service", client.DefaultClient)
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
		Username:username,
		Password:password,

	})
	if err != nil {
		// ...
	}

	return resp, err
}

func CallGetAccessToken(redirectUri string, code string) (*loginProto.AccessResp, error) {
	resp, err := LoginClient.GetAccessToken(context.TODO(), &loginProto.CodeReq{
		RedirectUri : redirectUri,
		Code : code,
	})
	if err != nil {
		// ...
	}

	return resp, err
}

