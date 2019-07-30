package handler

import (
	"context"
	"github.com/stretchr/testify/assert"
	user "jing/app/user/proto/user"
	"testing"
)

func TestUserService_Register(t *testing.T) {
	a := assert.New(t)
	us := UserService{}
	regReq := user.RegReq{
		Username: "username",
		Password: "password",
		Nickname: "nickname",
		Phone: "12345677654",
		Jaccount: "JACCOUNT",
	}
	regResp := user.RegResp{}
	_ = us.Register(context.TODO(), &regReq, &regResp)
	a.Equal(int32(200), regResp.Status)
	_ = us.Register(context.TODO(), &regReq, &regResp)
	a.Equal(int32(400), regResp.Status)
}

func TestUserService_Update(t *testing.T) {
	a := assert.New(t)
	us := UserService{}
	updateReq := user.UpdateReq{
		Id: 1,
		Nickname: "nickname1",
		Phone: "12345674567",
		Signature: "signature",
	}
	updateResp := user.UpdateResp{}
	_ = us.Update(context.TODO(), &updateReq, &updateResp)
	a.Equal(int32(200), updateResp.Status)
	updateReq.Id = 100
	_ = us.Update(context.TODO(), &updateReq, &updateResp)
	a.Equal(int32(400), updateResp.Status)
}

func TestUserService_FindUser(t *testing.T) {
	a := assert.New(t)
	us := UserService{}
	findReq := user.FindReq{
		Id: 1,
	}
	findResp := user.FindResp{}
	_ = us.FindUser(context.TODO(), &findReq, &findResp)
	a.Equal(int32(1), findResp.Id)
	a.Equal("username", findResp.Username)
	a.Equal("nickname1", findResp.Nickname)
	a.Equal("12345674567", findResp.Phone)
	a.Equal("JACCOUNT", findResp.Jaccount)
	a.Equal("signature", findResp.Signature)
	findReq = user.FindReq{
		Id: 100,
	}
	findResp = user.FindResp{}
	_ = us.FindUser(context.TODO(), &findReq, &findResp)
	a.Equal(int32(-1), findResp.Id)
}