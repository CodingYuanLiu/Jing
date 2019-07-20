package handler

import (
	"context"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/jameskeane/bcrypt"
	json2 "jing/app/json"
)
import user "jing/app/user/proto/user"
import "jing/app/login/handler"
import "jing/app/dao"

type UserService struct {

}

func (h *UserService) Update(ctx context.Context, in *user.UpdateReq, out *user.UpdateResp) error {
	var err error
	if in.Phone != "" {
		err = dao.UpdateUserById(int(in.Id), "phone", in.Phone)
	}
	if err != nil {
		out.Status = 400
		return err
	}
	if in.Nickname != "" {
		_ = dao.UpdateUserById(int(in.Id), "nickname", in.Nickname)
	}
	if in.Signature != "" {
		_ = dao.UpdateUserById(int(in.Id), "signature", in.Signature)
	}
	out.Status = 200
	return nil
}

func (h *UserService) Register(ctx context.Context, in *user.RegReq, out *user.RegResp) error {
	code, _ := bcrypt.Salt(10)
	password, _ := bcrypt.Hash(in.Password, code)
	json := json2.JSON{
		"username": in.Username,
		"password": password,
		"nickname": in.Nickname,
		"phone": in.Phone,
	}
	token, st := handler.ParseToken(in.Jwt)
	if st != 0 {
		out.Status = 400
		return errors.New("invalid token")
	}
	userID := int(token.Claims.(jwt.MapClaims)["userId"].(float64))
	user, err := dao.FindUserById(userID)
	if err != nil {
		out.Status = 400
		return err
	}
	if user.Username != "" {
		out.Status = 400
		return errors.New("you've already registered")
	}
	err = dao.CreateUser(json, userID)
	if err != nil {
		out.Status = 400
		return err
	}
	out.Status = 200
	return nil
}

func (h *UserService) FindUser(ctx context.Context, in *user.FindReq, out *user.FindResp) error {
	user2, err := dao.FindUserById(int(in.Id))
	if err != nil {
		out.Id = -1
		return err
	} else {
		domain := "puo7ltwok.bkt.clouddn.com"
		out.Id = int32(user2.ID)
		out.Username = user2.Username
		out.Jaccount = user2.Jaccount
		out.Phone = user2.Phone
		out.Nickname = user2.Nickname
		out.Signature = user2.Signature
		out.AvatarUrl = "http://" + domain + "/" + user2.AvatarKey
		return nil
	}
}
