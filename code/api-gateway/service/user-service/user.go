package user_service

import (
	userCli "jing/app/api-gateway/cli/user"
	userProto "jing/app/api-gateway/proto/user"
	"log"
	"strconv"
)

type UserService struct {
}

type RegisterBody struct {
	Username string `json:"username" binding : "required"`
	Password string `json:"password" binding : "required"`
	Phone string `json:"phone" binding : "required"`
	Nickname string `json:"nickname" binding : "required"`
	Jaccount string `json:"jaccount" binding : "required"`
}

type UpdateBody struct {
	Id int `json:"id" binding: "required"`
	Phone string `json:"phone" binding: "optional"`
	Signature string `json:"signature" binding :"optional"`
	Nickname string `json: "nickname" binding: "optional"`
}

func (us *UserService) RegisterSrv(body *RegisterBody) *userProto.RegResp{
	rsp, err := userCli.CallRegister(body.Username, body.Password,
		body.Phone, body.Nickname, body.Jaccount)

	if err != nil {
		//...
	}

	return rsp
}

func (us *UserService) UpdateUserSrv(body *UpdateBody) *userProto.UpdateResp{

	rsp, err := userCli.CallUpdateUser(int32(body.Id), body.Phone, body.Signature,
			body.Nickname)

	if err != nil {
		log.Println(err)
		return nil
	}
	return rsp
}


func (us *UserService) QueryUserSrv(idParam string) *userProto.FindResp {
	id, err := strconv.Atoi(idParam)
	if err != nil {
		log.Println(err)
		return nil
	}
	rsp, err := userCli.CallQueryUser(int32(id))
	if err != nil {
		log.Println(err)
		return nil
	}
	return rsp
}
