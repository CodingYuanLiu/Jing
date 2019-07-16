package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jameskeane/bcrypt"
	"io/ioutil"
	json2 "jing/app/json"
	"jing/app/login/dao"
	"jing/app/login/model"
	login "jing/app/login/proto/login"
	userDao "jing/app/user/dao"
	"net/http"
	"strconv"
	"time"
)

type LoginService struct {

}

func BuildToken(user userDao.User) (tokenString string) {
	claims := make(jwt.MapClaims)
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
		out.Status = 11
		return nil
	}
	jaccount := profile["entities"].([]interface {})[0].(map[string]interface {})["account"].(string)
	user, err := dao.FindUserByJaccount(jaccount)
	if err != nil {
		out.Status = 12
	} else {
		out.Status = 0
		out.JwtToken = BuildToken(user)
	}
	return nil
}

func (s *LoginService) LoginByUP(ctx context.Context, in *login.UPReq, out *login.TokenResp) error {
	user, err := dao.FindUserByUsername(in.Username)
	if err != nil {
		out.Status = 1
		return nil
	} else {
		if bcrypt.Match(in.Password, user.Password) {
			out.Status = 0
			out.JwtToken = BuildToken(user)
			return nil
		} else {
			out.Status = 1
			return nil
		}
	}
}

func (s *LoginService) LoginByWx(ctx context.Context, in *login.WxReq, out *login.TokenResp) error {
	code := in.Code
	resp, err := http.Get(fmt.Sprintf("https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
		"wx5bd0c2b91b75fd41", "d074420c87722879111087314aa4b17d", code))
	if err != nil {
		out.Status = -1
		return nil
	}
	respJson, _ := ioutil.ReadAll(resp.Body)
	j := json2.JSON{}
	_ = json.Unmarshal(respJson, &j)
	if j["errcode"] != nil {
		errcode := int(j["errcode"].(float64))
		if errcode == 40029 {
			out.Status = 1
			return nil
		} else if errcode != 0 {
			out.Status = -1
			return nil
		}
	}
	openId := j["openid"].(string)
	user, err := dao.FindUserByOpenId(openId)
	if err != nil {
		_ = dao.CreateUserByOpenId(openId)
		user, _ = dao.FindUserByOpenId(openId)
		out.Status = 21
	} else if user.Jaccount == "" {
		out.Status = 21
	} else if user.Nickname == "" {
		out.Status = 22
	} else {
		out.Status = 0
	}
	out.JwtToken = BuildToken(user)
	return nil
}

func (s *LoginService) BindJwtAndJaccount(ctx context.Context, in *login.BindReq, out *login.BindResp) error {
	token, status := parseToken(in.Jwt)
	if status == 0 {
		claims := token.Claims.(jwt.MapClaims)
		userId := int(claims["userId"].(float64))
		fmt.Println(userId)
		fmt.Println(in.Jaccount)
		_, err := dao.FindUserByJaccount(in.Jaccount)
		if err != nil {
			err2 := dao.BindJaccountById(userId, in.Jaccount)
			if err2 != nil {
				out.Status = 1
			}
			out.Status = 0
		} else {
			out.Status = 2
		}
	}
	return nil
}

func (s *LoginService) GetJaccount(ctx context.Context, in *login.CodeReq, out *login.JaccResp) error {
	code := in.Code
	redirectUri := in.RedirectUri
	accessToken := model.GetAccessToken(code, "KIr40g1K90EObtNARwda", "16BA4A646213794CD6C72F32F219D37A4AE51345897AC889", redirectUri)
	profile := model.GetProfile(accessToken)
	jaccount := profile["entities"].([]interface {})[0].(map[string]interface {})["account"].(string)
	out.Jaccount = jaccount
	return nil
}

func (s *LoginService) Auth(ctx context.Context, req *login.AuthReq, resp *login.AuthResp) error {
	token, status := parseToken(req.Jwt)
	resp.Status = status
	if status == 0 {
		claims := token.Claims.(jwt.MapClaims)
		resp.UserId = int32(claims["userId"].(float64))
		resp.Admin, _ = strconv.ParseBool(claims["admin"].(string))
	} else {
		resp.UserId = -1
		resp.Admin = false
	}
	return nil
}

func parseToken(tokenString string) (t *jwt.Token, status int32) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("lqynb"), nil
	})
	if err != nil {
		return nil, -2
	}
	if !token.Valid {
		return nil, -1
	}
	return token, 0
}
