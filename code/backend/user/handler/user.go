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
	if in.Gender != -1 {
		_ = dao.UpdateUserById(int(in.Id), "gender", in.Gender)
	}
	if in.Birthday != "" {
		_ = dao.UpdateUserById(int(in.Id), "birthday", in.Birthday)
	}
	if in.Major != "" {
		_ = dao.UpdateUserById(int(in.Id), "major", in.Major)
	}
	if in.Dormitory != "" {
		_ = dao.UpdateUserById(int(in.Id), "dormitory", in.Dormitory)
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
		if in.Id == in.UserId {
			out.Privacy = 0
		} else if user2.PrivacyLevel == 1 {
			flag := false
			friends := dao.GetFriends(int(in.UserId))
			for _, v := range friends {
				if v == user2.ID {
					flag = true
					break
				}
			}
			if flag {
				out.Privacy = 2
			} else {
				out.Privacy = 1
			}
		} else {
			out.Privacy = int32(user2.PrivacyLevel)
		}
		domain := "puo7ltwok.bkt.clouddn.com"
		out.Id = int32(user2.ID)
		out.Username = user2.Username
		out.Password = user2.Password
		out.Jaccount = user2.Jaccount
		out.Phone = user2.Phone
		out.Nickname = user2.Nickname
		out.Signature = user2.Signature
		out.Birthday = user2.Birthday
		out.Dormitory = user2.Dormitory
		out.Gender = int32(user2.Gender)
		out.Major = user2.Major
		out.AvatarUrl = "http://" + domain + "/" + user2.AvatarKey
		return nil
	}
}
