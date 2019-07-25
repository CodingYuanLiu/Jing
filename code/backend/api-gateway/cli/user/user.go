package user

import (
	"context"
	"github.com/micro/go-micro/client"
	"github.com/micro/go-micro/client/grpc"
	"github.com/micro/go-plugins/registry/kubernetes"
	userProto "jing/app/user/proto/user"
	"os"
)

var (
	Client userProto.UserService
)

func init() {
	os.Setenv("MICRO_REGISTRY", "kubernetes")
	client.DefaultClient = grpc.NewClient(
		client.Registry(kubernetes.NewRegistry()),
	)
	Client = userProto.NewUserService("user", client.DefaultClient)
}

func CallUpdateUser(id int, jsonForm map[string]interface{}) (*userProto.UpdateResp, error) {

	req := new(userProto.UpdateReq)
	req.Id = int32(id)

	req.Phone = jsonForm["phone"].(string)
	req.Birthday = jsonForm["birthday"].(string)
	req.Major = jsonForm["major"].(string)
	req.Dormitory = jsonForm["dormitory"].(string)
	req.Signature = jsonForm["signature"].(string)
	req.Nickname = jsonForm["nickname"].(string)
	req.Gender = int32(jsonForm["gender"].(float64))

	rsp, err := Client.Update(context.TODO(), req)

	if err != nil {
		return rsp, err
	}

	return rsp, nil
}

func CallRegister(username string, password string,
	phone string, nickname string, jaccount string,
) (*userProto.RegResp, error) {
	rsp, err := Client.Register(context.TODO(), &userProto.RegReq{
		Username: username,
		Password: password,
		Phone:    phone,
		Nickname: nickname,
		Jwt: jaccount,
	})

	if err != nil {
		return rsp, err
	}
	return rsp, nil
}

func CallQueryUser(id int32, userId int32) (*userProto.FindResp, error) {
	rsp, err := Client.FindUser(context.TODO(), &userProto.FindReq{
		Id: id,
		UserId: userId,
	})
	if err != nil {
		return rsp, err
	}
	return rsp, err
}
