package handler

import (
	"jing/app/login/dao"
	"jing/app/login/model"
	login "jing/app/login/proto/login"
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/jameskeane/bcrypt"
	"time"
)

type LoginService struct {

}

func buildToken(user dao.User) (tokenString string) {
	claims := make(jwt.MapClaims)
	claims["username"] = user.Username
	claims["userId"] = user.ID
	claims["admin"] = "false"
	claims["exp"] = time.Now().Add(time.Hour).Unix()
	claims["iat"] = time.Now().Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ = token.SignedString([]byte("lqynb"))
	return
}

func (s *LoginService) GetAccessToken(ctx context.Context, in *login.CodeReq, out *login.AccessResp) error {
	code := in.Code
	redirectUri := in.RedirectUri
	out.AccessToken = model.GetAccessToken(code, "KIr40g1K90EObtNARwda", "16BA4A646213794CD6C72F32F219D37A4AE51345897AC889", redirectUri)
	return nil
}

func (s *LoginService) LoginByJaccount(ctx context.Context, in *login.LJReq, out *login.TokenResp) error {
	profile := model.GetProfile(in.AccessToken)
	e := int(profile["errno"].(float64))
	if e != 0 {
		out.Status = -1
		return nil
	}
	jaccount := profile["entities"].([]interface {})[0].(map[string]interface {})["account"].(string)
	user, err := dao.FindUserByJaccount(jaccount)
	if err != nil {
		out.Status = -2
	} else {
		out.Status = 0
		out.JwtToken = buildToken(user)
	}
	return nil
}

func (s *LoginService) LoginByUP(ctx context.Context, in *login.UPReq, out *login.TokenResp) error {
	user, err := dao.FindUserByUsername(in.Username)
	if err != nil {
		out.Status = 401
		return nil
	} else {
		if bcrypt.Match(in.Password, user.Password) {
			out.Status = 200
			out.JwtToken = buildToken(user)
			return nil
		} else {
			out.Status = 401
			return nil
		}
	}
}

func (s *LoginService) Auth(ctx context.Context, req *login.AuthReq, resp *login.AuthResp) error {
	token, status := parseToken(req.Jwt)
	resp.Status = status
	if status == 0 {
		claims := token.Claims.(jwt.MapClaims)
		resp.UserId = claims["userId"].(int32)
		resp.Username = claims["username"].(string)
		resp.Admin = claims["admin"].(bool)
	} else {
		resp.UserId = -1
		resp.Username = ""
		resp.Admin = false
	}
	return nil
}

func parseToken(tokenString string) (t *jwt.Token, status int32) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("lqynb"), nil
	})
	if token == nil {
		return nil, -3
	}
	if err != nil {
		return nil, -2
	}
	if !token.Valid {
		return nil, -1
	}
	return token, 0
}
