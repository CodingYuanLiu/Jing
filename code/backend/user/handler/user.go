package handler

import (
	"context"
	"github.com/jameskeane/bcrypt"
	json2 "jing/app/json"
)
import user "jing/app/user/proto/user"
import "jing/app/user/dao"

type UserService struct {

}

func (h *UserService) Update(ctx context.Context, in *user.UpdateReq, out *user.UpdateResp) error {
	err := dao.UpdateUserById(int(in.Id), "phone", in.Phone)
	if err != nil {
		out.Status = 400
		return nil
	}
	_ = dao.UpdateUserById(int(in.Id), "nickname", in.Nickname)
	_ = dao.UpdateUserById(int(in.Id), "signature", in.Signature)
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
		"jaccount": in.Jaccount,
	}
	err := dao.CreateUser(json)
	if err != nil {
		out.Status = 400
		return nil
	}
	out.Status = 200
	return nil
}

func (h *UserService) FindUser(ctx context.Context, in *user.FindReq, out *user.FindResp) error {
	user2, err := dao.FindUserById(int(in.Id))
	if err != nil {
		out.Id = -1
		return nil
	} else {
		out.Id = int32(user2.ID)
		out.Username = user2.Username
		out.Jaccount = user2.Jaccount
		out.Phone = user2.Phone
		out.Nickname = user2.Nickname
		out.Signature = user2.Signature
		return nil
	}
}
