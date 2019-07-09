// Code generated by protoc-gen-micro. DO NOT EDIT.
// source: proto/activity.proto

package activity

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

// Client API for ActivitySrv service

type ActivitySrvService interface {
	Publish(ctx context.Context, in *PubReq, opts ...client.CallOption) (*PubResp, error)
	//rpc Modify(MdfReq) returns (MdfResp){}
	Delete(ctx context.Context, in *DltReq, opts ...client.CallOption) (*DltResp, error)
	Query(ctx context.Context, in *QryReq, opts ...client.CallOption) (*QryResp, error)
}

type activitySrvService struct {
	c    client.Client
	name string
}

func NewActivitySrvService(name string, c client.Client) ActivitySrvService {
	if c == nil {
		c = client.NewClient()
	}
	if len(name) == 0 {
		name = "activity"
	}
	return &activitySrvService{
		c:    c,
		name: name,
	}
}

func (c *activitySrvService) Publish(ctx context.Context, in *PubReq, opts ...client.CallOption) (*PubResp, error) {
	req := c.c.NewRequest(c.name, "ActivitySrv.Publish", in)
	out := new(PubResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *activitySrvService) Delete(ctx context.Context, in *DltReq, opts ...client.CallOption) (*DltResp, error) {
	req := c.c.NewRequest(c.name, "ActivitySrv.Delete", in)
	out := new(DltResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *activitySrvService) Query(ctx context.Context, in *QryReq, opts ...client.CallOption) (*QryResp, error) {
	req := c.c.NewRequest(c.name, "ActivitySrv.Query", in)
	out := new(QryResp)
	err := c.c.Call(ctx, req, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for ActivitySrv service

type ActivitySrvHandler interface {
	Publish(context.Context, *PubReq, *PubResp) error
	//rpc Modify(MdfReq) returns (MdfResp){}
	Delete(context.Context, *DltReq, *DltResp) error
	Query(context.Context, *QryReq, *QryResp) error
}

func RegisterActivitySrvHandler(s server.Server, hdlr ActivitySrvHandler, opts ...server.HandlerOption) error {
	type activitySrv interface {
		Publish(ctx context.Context, in *PubReq, out *PubResp) error
		Delete(ctx context.Context, in *DltReq, out *DltResp) error
		Query(ctx context.Context, in *QryReq, out *QryResp) error
	}
	type ActivitySrv struct {
		activitySrv
	}
	h := &activitySrvHandler{hdlr}
	return s.Handle(s.NewHandler(&ActivitySrv{h}, opts...))
}

type activitySrvHandler struct {
	ActivitySrvHandler
}

func (h *activitySrvHandler) Publish(ctx context.Context, in *PubReq, out *PubResp) error {
	return h.ActivitySrvHandler.Publish(ctx, in, out)
}

func (h *activitySrvHandler) Delete(ctx context.Context, in *DltReq, out *DltResp) error {
	return h.ActivitySrvHandler.Delete(ctx, in, out)
}

func (h *activitySrvHandler) Query(ctx context.Context, in *QryReq, out *QryResp) error {
	return h.ActivitySrvHandler.Query(ctx, in, out)
}
