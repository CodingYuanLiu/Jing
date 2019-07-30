// Code generated by protoc-gen-go. DO NOT EDIT.
// source: login.proto

package go_micro_srv_login

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
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

type JwtReq struct {
	UserId               int32    `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *JwtReq) Reset()         { *m = JwtReq{} }
func (m *JwtReq) String() string { return proto.CompactTextString(m) }
func (*JwtReq) ProtoMessage()    {}
func (*JwtReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{0}
}

func (m *JwtReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_JwtReq.Unmarshal(m, b)
}
func (m *JwtReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_JwtReq.Marshal(b, m, deterministic)
}
func (m *JwtReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_JwtReq.Merge(m, src)
}
func (m *JwtReq) XXX_Size() int {
	return xxx_messageInfo_JwtReq.Size(m)
}
func (m *JwtReq) XXX_DiscardUnknown() {
	xxx_messageInfo_JwtReq.DiscardUnknown(m)
}

var xxx_messageInfo_JwtReq proto.InternalMessageInfo

func (m *JwtReq) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

type JwtResp struct {
	JwtToken             string   `protobuf:"bytes,1,opt,name=jwtToken,proto3" json:"jwtToken,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *JwtResp) Reset()         { *m = JwtResp{} }
func (m *JwtResp) String() string { return proto.CompactTextString(m) }
func (*JwtResp) ProtoMessage()    {}
func (*JwtResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{1}
}

func (m *JwtResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_JwtResp.Unmarshal(m, b)
}
func (m *JwtResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_JwtResp.Marshal(b, m, deterministic)
}
func (m *JwtResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_JwtResp.Merge(m, src)
}
func (m *JwtResp) XXX_Size() int {
	return xxx_messageInfo_JwtResp.Size(m)
}
func (m *JwtResp) XXX_DiscardUnknown() {
	xxx_messageInfo_JwtResp.DiscardUnknown(m)
}

var xxx_messageInfo_JwtResp proto.InternalMessageInfo

func (m *JwtResp) GetJwtToken() string {
	if m != nil {
		return m.JwtToken
	}
	return ""
}

type JaccResp struct {
	Jaccount             string   `protobuf:"bytes,1,opt,name=jaccount,proto3" json:"jaccount,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *JaccResp) Reset()         { *m = JaccResp{} }
func (m *JaccResp) String() string { return proto.CompactTextString(m) }
func (*JaccResp) ProtoMessage()    {}
func (*JaccResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{2}
}

func (m *JaccResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_JaccResp.Unmarshal(m, b)
}
func (m *JaccResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_JaccResp.Marshal(b, m, deterministic)
}
func (m *JaccResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_JaccResp.Merge(m, src)
}
func (m *JaccResp) XXX_Size() int {
	return xxx_messageInfo_JaccResp.Size(m)
}
func (m *JaccResp) XXX_DiscardUnknown() {
	xxx_messageInfo_JaccResp.DiscardUnknown(m)
}

var xxx_messageInfo_JaccResp proto.InternalMessageInfo

func (m *JaccResp) GetJaccount() string {
	if m != nil {
		return m.Jaccount
	}
	return ""
}

type BindReq struct {
	Jwt                  string   `protobuf:"bytes,1,opt,name=jwt,proto3" json:"jwt,omitempty"`
	Jaccount             string   `protobuf:"bytes,2,opt,name=jaccount,proto3" json:"jaccount,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BindReq) Reset()         { *m = BindReq{} }
func (m *BindReq) String() string { return proto.CompactTextString(m) }
func (*BindReq) ProtoMessage()    {}
func (*BindReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{3}
}

func (m *BindReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BindReq.Unmarshal(m, b)
}
func (m *BindReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BindReq.Marshal(b, m, deterministic)
}
func (m *BindReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BindReq.Merge(m, src)
}
func (m *BindReq) XXX_Size() int {
	return xxx_messageInfo_BindReq.Size(m)
}
func (m *BindReq) XXX_DiscardUnknown() {
	xxx_messageInfo_BindReq.DiscardUnknown(m)
}

var xxx_messageInfo_BindReq proto.InternalMessageInfo

func (m *BindReq) GetJwt() string {
	if m != nil {
		return m.Jwt
	}
	return ""
}

func (m *BindReq) GetJaccount() string {
	if m != nil {
		return m.Jaccount
	}
	return ""
}

type BindResp struct {
	Status               int32    `protobuf:"varint,12,opt,name=status,proto3" json:"status,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BindResp) Reset()         { *m = BindResp{} }
func (m *BindResp) String() string { return proto.CompactTextString(m) }
func (*BindResp) ProtoMessage()    {}
func (*BindResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{4}
}

func (m *BindResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BindResp.Unmarshal(m, b)
}
func (m *BindResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BindResp.Marshal(b, m, deterministic)
}
func (m *BindResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BindResp.Merge(m, src)
}
func (m *BindResp) XXX_Size() int {
	return xxx_messageInfo_BindResp.Size(m)
}
func (m *BindResp) XXX_DiscardUnknown() {
	xxx_messageInfo_BindResp.DiscardUnknown(m)
}

var xxx_messageInfo_BindResp proto.InternalMessageInfo

func (m *BindResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

type AccessResp struct {
	AccessToken          string   `protobuf:"bytes,11,opt,name=access_token,json=accessToken,proto3" json:"access_token,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *AccessResp) Reset()         { *m = AccessResp{} }
func (m *AccessResp) String() string { return proto.CompactTextString(m) }
func (*AccessResp) ProtoMessage()    {}
func (*AccessResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{5}
}

func (m *AccessResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AccessResp.Unmarshal(m, b)
}
func (m *AccessResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AccessResp.Marshal(b, m, deterministic)
}
func (m *AccessResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AccessResp.Merge(m, src)
}
func (m *AccessResp) XXX_Size() int {
	return xxx_messageInfo_AccessResp.Size(m)
}
func (m *AccessResp) XXX_DiscardUnknown() {
	xxx_messageInfo_AccessResp.DiscardUnknown(m)
}

var xxx_messageInfo_AccessResp proto.InternalMessageInfo

func (m *AccessResp) GetAccessToken() string {
	if m != nil {
		return m.AccessToken
	}
	return ""
}

type CodeReq struct {
	RedirectUri          string   `protobuf:"bytes,9,opt,name=redirect_uri,json=redirectUri,proto3" json:"redirect_uri,omitempty"`
	Code                 string   `protobuf:"bytes,10,opt,name=code,proto3" json:"code,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CodeReq) Reset()         { *m = CodeReq{} }
func (m *CodeReq) String() string { return proto.CompactTextString(m) }
func (*CodeReq) ProtoMessage()    {}
func (*CodeReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{6}
}

func (m *CodeReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CodeReq.Unmarshal(m, b)
}
func (m *CodeReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CodeReq.Marshal(b, m, deterministic)
}
func (m *CodeReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CodeReq.Merge(m, src)
}
func (m *CodeReq) XXX_Size() int {
	return xxx_messageInfo_CodeReq.Size(m)
}
func (m *CodeReq) XXX_DiscardUnknown() {
	xxx_messageInfo_CodeReq.DiscardUnknown(m)
}

var xxx_messageInfo_CodeReq proto.InternalMessageInfo

func (m *CodeReq) GetRedirectUri() string {
	if m != nil {
		return m.RedirectUri
	}
	return ""
}

func (m *CodeReq) GetCode() string {
	if m != nil {
		return m.Code
	}
	return ""
}

type AuthReq struct {
	Jwt                  string   `protobuf:"bytes,1,opt,name=jwt,proto3" json:"jwt,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *AuthReq) Reset()         { *m = AuthReq{} }
func (m *AuthReq) String() string { return proto.CompactTextString(m) }
func (*AuthReq) ProtoMessage()    {}
func (*AuthReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{7}
}

func (m *AuthReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AuthReq.Unmarshal(m, b)
}
func (m *AuthReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AuthReq.Marshal(b, m, deterministic)
}
func (m *AuthReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AuthReq.Merge(m, src)
}
func (m *AuthReq) XXX_Size() int {
	return xxx_messageInfo_AuthReq.Size(m)
}
func (m *AuthReq) XXX_DiscardUnknown() {
	xxx_messageInfo_AuthReq.DiscardUnknown(m)
}

var xxx_messageInfo_AuthReq proto.InternalMessageInfo

func (m *AuthReq) GetJwt() string {
	if m != nil {
		return m.Jwt
	}
	return ""
}

type AuthResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	UserId               int32    `protobuf:"varint,2,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	Admin                bool     `protobuf:"varint,3,opt,name=admin,proto3" json:"admin,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *AuthResp) Reset()         { *m = AuthResp{} }
func (m *AuthResp) String() string { return proto.CompactTextString(m) }
func (*AuthResp) ProtoMessage()    {}
func (*AuthResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{8}
}

func (m *AuthResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AuthResp.Unmarshal(m, b)
}
func (m *AuthResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AuthResp.Marshal(b, m, deterministic)
}
func (m *AuthResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AuthResp.Merge(m, src)
}
func (m *AuthResp) XXX_Size() int {
	return xxx_messageInfo_AuthResp.Size(m)
}
func (m *AuthResp) XXX_DiscardUnknown() {
	xxx_messageInfo_AuthResp.DiscardUnknown(m)
}

var xxx_messageInfo_AuthResp proto.InternalMessageInfo

func (m *AuthResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *AuthResp) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *AuthResp) GetAdmin() bool {
	if m != nil {
		return m.Admin
	}
	return false
}

type LJReq struct {
	AccessToken          string   `protobuf:"bytes,2,opt,name=access_token,json=accessToken,proto3" json:"access_token,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *LJReq) Reset()         { *m = LJReq{} }
func (m *LJReq) String() string { return proto.CompactTextString(m) }
func (*LJReq) ProtoMessage()    {}
func (*LJReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{9}
}

func (m *LJReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_LJReq.Unmarshal(m, b)
}
func (m *LJReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_LJReq.Marshal(b, m, deterministic)
}
func (m *LJReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_LJReq.Merge(m, src)
}
func (m *LJReq) XXX_Size() int {
	return xxx_messageInfo_LJReq.Size(m)
}
func (m *LJReq) XXX_DiscardUnknown() {
	xxx_messageInfo_LJReq.DiscardUnknown(m)
}

var xxx_messageInfo_LJReq proto.InternalMessageInfo

func (m *LJReq) GetAccessToken() string {
	if m != nil {
		return m.AccessToken
	}
	return ""
}

type TokenResp struct {
	Status int32 `protobuf:"varint,4,opt,name=status,proto3" json:"status,omitempty"`
	// uncaught error = -1, success = 0, incorrect = 1, access_token expired = 11, invalid jaccount = 12, need jaccount = 21 (weixin), need fill form = 22
	JwtToken             string   `protobuf:"bytes,5,opt,name=jwt_token,json=jwtToken,proto3" json:"jwt_token,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TokenResp) Reset()         { *m = TokenResp{} }
func (m *TokenResp) String() string { return proto.CompactTextString(m) }
func (*TokenResp) ProtoMessage()    {}
func (*TokenResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{10}
}

func (m *TokenResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TokenResp.Unmarshal(m, b)
}
func (m *TokenResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TokenResp.Marshal(b, m, deterministic)
}
func (m *TokenResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TokenResp.Merge(m, src)
}
func (m *TokenResp) XXX_Size() int {
	return xxx_messageInfo_TokenResp.Size(m)
}
func (m *TokenResp) XXX_DiscardUnknown() {
	xxx_messageInfo_TokenResp.DiscardUnknown(m)
}

var xxx_messageInfo_TokenResp proto.InternalMessageInfo

func (m *TokenResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *TokenResp) GetJwtToken() string {
	if m != nil {
		return m.JwtToken
	}
	return ""
}

type UPReq struct {
	Username             string   `protobuf:"bytes,3,opt,name=username,proto3" json:"username,omitempty"`
	Password             string   `protobuf:"bytes,4,opt,name=password,proto3" json:"password,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *UPReq) Reset()         { *m = UPReq{} }
func (m *UPReq) String() string { return proto.CompactTextString(m) }
func (*UPReq) ProtoMessage()    {}
func (*UPReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{11}
}

func (m *UPReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_UPReq.Unmarshal(m, b)
}
func (m *UPReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_UPReq.Marshal(b, m, deterministic)
}
func (m *UPReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_UPReq.Merge(m, src)
}
func (m *UPReq) XXX_Size() int {
	return xxx_messageInfo_UPReq.Size(m)
}
func (m *UPReq) XXX_DiscardUnknown() {
	xxx_messageInfo_UPReq.DiscardUnknown(m)
}

var xxx_messageInfo_UPReq proto.InternalMessageInfo

func (m *UPReq) GetUsername() string {
	if m != nil {
		return m.Username
	}
	return ""
}

func (m *UPReq) GetPassword() string {
	if m != nil {
		return m.Password
	}
	return ""
}

type WxReq struct {
	Code                 string   `protobuf:"bytes,5,opt,name=code,proto3" json:"code,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *WxReq) Reset()         { *m = WxReq{} }
func (m *WxReq) String() string { return proto.CompactTextString(m) }
func (*WxReq) ProtoMessage()    {}
func (*WxReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_67c21677aa7f4e4f, []int{12}
}

func (m *WxReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_WxReq.Unmarshal(m, b)
}
func (m *WxReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_WxReq.Marshal(b, m, deterministic)
}
func (m *WxReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_WxReq.Merge(m, src)
}
func (m *WxReq) XXX_Size() int {
	return xxx_messageInfo_WxReq.Size(m)
}
func (m *WxReq) XXX_DiscardUnknown() {
	xxx_messageInfo_WxReq.DiscardUnknown(m)
}

var xxx_messageInfo_WxReq proto.InternalMessageInfo

func (m *WxReq) GetCode() string {
	if m != nil {
		return m.Code
	}
	return ""
}

func init() {
	proto.RegisterType((*JwtReq)(nil), "go.micro.srv.login.JwtReq")
	proto.RegisterType((*JwtResp)(nil), "go.micro.srv.login.JwtResp")
	proto.RegisterType((*JaccResp)(nil), "go.micro.srv.login.JaccResp")
	proto.RegisterType((*BindReq)(nil), "go.micro.srv.login.BindReq")
	proto.RegisterType((*BindResp)(nil), "go.micro.srv.login.BindResp")
	proto.RegisterType((*AccessResp)(nil), "go.micro.srv.login.AccessResp")
	proto.RegisterType((*CodeReq)(nil), "go.micro.srv.login.CodeReq")
	proto.RegisterType((*AuthReq)(nil), "go.micro.srv.login.AuthReq")
	proto.RegisterType((*AuthResp)(nil), "go.micro.srv.login.AuthResp")
	proto.RegisterType((*LJReq)(nil), "go.micro.srv.login.LJReq")
	proto.RegisterType((*TokenResp)(nil), "go.micro.srv.login.TokenResp")
	proto.RegisterType((*UPReq)(nil), "go.micro.srv.login.UPReq")
	proto.RegisterType((*WxReq)(nil), "go.micro.srv.login.WxReq")
}

func init() { proto.RegisterFile("login.proto", fileDescriptor_67c21677aa7f4e4f) }

var fileDescriptor_67c21677aa7f4e4f = []byte{
	// 523 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x94, 0x54, 0x51, 0x6f, 0xd3, 0x3c,
	0x14, 0x4d, 0xb7, 0xa6, 0x49, 0x6e, 0xab, 0xef, 0x43, 0x16, 0x82, 0x90, 0x02, 0xea, 0x2c, 0x81,
	0x26, 0x1e, 0x82, 0x04, 0x0f, 0x3c, 0x42, 0xd7, 0x87, 0x8a, 0x68, 0xc0, 0x16, 0x51, 0xed, 0xb1,
	0x0a, 0x89, 0x35, 0x52, 0x68, 0x1c, 0x62, 0x87, 0x8c, 0xbf, 0xcb, 0x2f, 0x41, 0xbe, 0x49, 0x3c,
	0x5a, 0xbc, 0x21, 0xde, 0x7c, 0x7c, 0x8f, 0x8f, 0x8f, 0x8f, 0xaf, 0x0d, 0xe3, 0xaf, 0xfc, 0x32,
	0x2f, 0xc2, 0xb2, 0xe2, 0x92, 0x13, 0x72, 0xc9, 0xc3, 0x6d, 0x9e, 0x56, 0x3c, 0x14, 0xd5, 0xf7,
	0x10, 0x2b, 0x74, 0x06, 0xa3, 0xa8, 0x91, 0x31, 0xfb, 0x46, 0xee, 0xc1, 0xa8, 0x16, 0xac, 0x7a,
	0x9b, 0xf9, 0x83, 0xd9, 0xe0, 0xd8, 0x8e, 0x3b, 0x44, 0x9f, 0x80, 0x83, 0x0c, 0x51, 0x92, 0x00,
	0xdc, 0x4d, 0x23, 0x3f, 0xf2, 0x2f, 0xac, 0x40, 0x92, 0x17, 0x6b, 0x4c, 0x9f, 0x82, 0x1b, 0x25,
	0x69, 0xaa, 0x79, 0x49, 0x9a, 0xf2, 0xba, 0x90, 0x9a, 0xd7, 0x61, 0xfa, 0x0a, 0x9c, 0x93, 0xbc,
	0xc8, 0xd4, 0x8e, 0x77, 0xe0, 0x70, 0xd3, 0xf4, 0x0c, 0x35, 0xdc, 0x59, 0x78, 0xb0, 0xb7, 0x90,
	0x82, 0xdb, 0x2e, 0x14, 0xa5, 0xf2, 0x2a, 0x64, 0x22, 0x6b, 0xe1, 0x4f, 0x5a, 0xaf, 0x2d, 0xa2,
	0xcf, 0x01, 0xe6, 0x69, 0xca, 0x84, 0x40, 0xd6, 0x11, 0x4c, 0x12, 0x44, 0x6b, 0x89, 0x96, 0xc7,
	0xa8, 0x38, 0x6e, 0xe7, 0x5a, 0xd7, 0x6f, 0xc0, 0x59, 0xf0, 0x8c, 0x29, 0x37, 0x47, 0x30, 0xa9,
	0x58, 0x96, 0x57, 0x2c, 0x95, 0xeb, 0xba, 0xca, 0x7d, 0xaf, 0x65, 0xf7, 0x73, 0xab, 0x2a, 0x27,
	0x04, 0x86, 0x29, 0xcf, 0x98, 0x0f, 0x58, 0xc2, 0x31, 0x9d, 0x82, 0x33, 0xaf, 0xe5, 0x67, 0xe3,
	0x79, 0xe8, 0x39, 0xb8, 0x6d, 0x71, 0xc7, 0xf3, 0xe0, 0x77, 0xcf, 0xe4, 0x3e, 0x38, 0x2a, 0xe9,
	0x75, 0x9e, 0xe1, 0x91, 0x75, 0xf0, 0xe4, 0x2e, 0xd8, 0x49, 0xb6, 0xcd, 0x0b, 0xff, 0x70, 0x36,
	0x38, 0x76, 0xe3, 0x16, 0xd0, 0x67, 0x60, 0x9f, 0x46, 0x9d, 0xdf, 0x9d, 0xd3, 0x1d, 0x98, 0x4e,
	0xe7, 0xe1, 0x60, 0x6f, 0xff, 0xe1, 0xce, 0xfe, 0x53, 0xf0, 0x36, 0x8d, 0xec, 0x44, 0xec, 0xbd,
	0x5b, 0x7d, 0x0d, 0xf6, 0xea, 0x4c, 0xed, 0x16, 0x80, 0xab, 0x6c, 0x15, 0xc9, 0x96, 0xa1, 0x1f,
	0x2f, 0xd6, 0x58, 0xd5, 0xca, 0x44, 0x88, 0x86, 0x57, 0x19, 0x6a, 0x7b, 0xb1, 0xc6, 0x74, 0x0a,
	0xf6, 0xc5, 0x95, 0x12, 0xe8, 0xb3, 0xb3, 0xaf, 0xb3, 0x7b, 0xf1, 0x73, 0x08, 0xf6, 0xa9, 0x6a,
	0x43, 0xb2, 0x80, 0xd1, 0x7b, 0xd6, 0x44, 0xaa, 0x05, 0xc2, 0x3f, 0xbb, 0x34, 0x6c, 0x5b, 0x34,
	0x98, 0xde, 0x58, 0x13, 0x25, 0xb5, 0xc8, 0x02, 0x86, 0x2a, 0x6d, 0x62, 0xa4, 0x75, 0x97, 0x14,
	0x3c, 0xbc, 0xb9, 0x88, 0x22, 0xef, 0xe0, 0x7f, 0xb4, 0x74, 0xf2, 0x23, 0xea, 0x3a, 0x8f, 0x3c,
	0x30, 0x2d, 0xc1, 0x4b, 0x08, 0x1e, 0x99, 0x4a, 0x3a, 0x73, 0x6a, 0x91, 0x25, 0x78, 0x9d, 0xdc,
	0xea, 0xcc, 0x2c, 0x84, 0xf9, 0xfe, 0x8b, 0xd0, 0xc5, 0x95, 0x59, 0x08, 0x73, 0xfe, 0xbb, 0xd0,
	0x07, 0xf8, 0x6f, 0xc9, 0xe4, 0xfc, 0xba, 0x4d, 0xcc, 0x79, 0x75, 0xcf, 0x22, 0x78, 0x6c, 0xcc,
	0x4b, 0x3f, 0x32, 0x6a, 0x91, 0x08, 0xc6, 0x4b, 0x26, 0x75, 0x5a, 0xb7, 0xaa, 0x19, 0xd3, 0xef,
	0xff, 0x0d, 0x6a, 0x91, 0x73, 0x20, 0xea, 0x91, 0x47, 0x8d, 0x9c, 0x17, 0xd9, 0xed, 0x92, 0xdd,
	0x2f, 0x62, 0x96, 0xec, 0x7f, 0x0a, 0x6a, 0x7d, 0x1a, 0xe1, 0xe7, 0xf7, 0xf2, 0x57, 0x00, 0x00,
	0x00, 0xff, 0xff, 0xa0, 0x9a, 0xcf, 0x81, 0x0b, 0x05, 0x00, 0x00,
}
