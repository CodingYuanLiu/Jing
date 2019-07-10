// Code generated by protoc-gen-micro. DO NOT EDIT.
// source: user.proto

package go_micro_srv_user

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

import (
	context "context"
	client "github.com/micro/go-micro/client"
	server "github.com/micro/go-micro/server"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ client.Option
var _ server.Option

// Client API for User service

type UserService interface {
	Update(ctx context.Context, in *UpdateReq, opts ...client.CallOption) (*UpdateResp, error)
	Register(ctx context.Context, in *RegReq, opts ...client.CallOption) (*RegResp, error)
	FindUser(ctx context.Context, in *FindReq, opts ...client.CallOption) (*FindResp, error)
}

type userService struct {
	c    client.Client
	name string
}

func NewUserService(name string, c client.Client) UserService {
	if c == nil {
		c = client.NewClient()
	}
	if len(name) == 0 {
		name = "go.micro.handler.user"
	}
	return &userService{
		c:    c,
		name: name,
	}
}

func (c *userService) Update(ctx context.Context, in *UpdateReq, opts ...client.CallOption) (*UpdateResp, error) {
	req := c.c.NewRequest(c.name, "User.Update", in)
	out := new(UpdateResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *userService) Register(ctx context.Context, in *RegReq, opts ...client.CallOption) (*RegResp, error) {
	req := c.c.NewRequest(c.name, "User.Register", in)
	out := new(RegResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *userService) FindUser(ctx context.Context, in *FindReq, opts ...client.CallOption) (*FindResp, error) {
	req := c.c.NewRequest(c.name, "User.FindUser", in)
	out := new(FindResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for User service

type UserHandler interface {
	Update(context.Context, *UpdateReq, *UpdateResp) error
	Register(context.Context, *RegReq, *RegResp) error
	FindUser(context.Context, *FindReq, *FindResp) error
}

func RegisterUserHandler(s server.Server, hdlr UserHandler, opts ...server.HandlerOption) error {
	type user interface {
		Update(ctx context.Context, in *UpdateReq, out *UpdateResp) error
		Register(ctx context.Context, in *RegReq, out *RegResp) error
		FindUser(ctx context.Context, in *FindReq, out *FindResp) error
	}
	type User struct {
		user
	}
	h := &userHandler{hdlr}
	return s.Handle(s.NewHandler(&User{h}, opts...))
}

type userHandler struct {
	UserHandler
}

func (h *userHandler) Update(ctx context.Context, in *UpdateReq, out *UpdateResp) error {
	return h.UserHandler.Update(ctx, in, out)
}

func (h *userHandler) Register(ctx context.Context, in *RegReq, out *RegResp) error {
	return h.UserHandler.Register(ctx, in, out)
}

func (h *userHandler) FindUser(ctx context.Context, in *FindReq, out *FindResp) error {
	return h.UserHandler.FindUser(ctx, in, out)
}
