// Code generated by protoc-gen-go. DO NOT EDIT.
// source: proto/activity.proto

package activity

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

type PubReq struct {
	Actid                int32    `protobuf:"varint,1,opt,name=actid,proto3" json:"actid,omitempty"`
	Type                 string   `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
	CreateTime           string   `protobuf:"bytes,3,opt,name=createTime,proto3" json:"createTime,omitempty"`
	EndTime              string   `protobuf:"bytes,4,opt,name=endTime,proto3" json:"endTime,omitempty"`
	Title                string   `protobuf:"bytes,5,opt,name=title,proto3" json:"title,omitempty"`
	Description          string   `protobuf:"bytes,6,opt,name=description,proto3" json:"description,omitempty"`
	Tag                  []string `protobuf:"bytes,7,rep,name=tag,proto3" json:"tag,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PubReq) Reset()         { *m = PubReq{} }
func (m *PubReq) String() string { return proto.CompactTextString(m) }
func (*PubReq) ProtoMessage()    {}
func (*PubReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_970235c7b4e4341e, []int{0}
}

func (m *PubReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PubReq.Unmarshal(m, b)
}
func (m *PubReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PubReq.Marshal(b, m, deterministic)
}
func (m *PubReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PubReq.Merge(m, src)
}
func (m *PubReq) XXX_Size() int {
	return xxx_messageInfo_PubReq.Size(m)
}
func (m *PubReq) XXX_DiscardUnknown() {
	xxx_messageInfo_PubReq.DiscardUnknown(m)
}

var xxx_messageInfo_PubReq proto.InternalMessageInfo

func (m *PubReq) GetActid() int32 {
	if m != nil {
		return m.Actid
	}
	return 0
}

func (m *PubReq) GetType() string {
	if m != nil {
		return m.Type
	}
	return ""
}

func (m *PubReq) GetCreateTime() string {
	if m != nil {
		return m.CreateTime
	}
	return ""
}

func (m *PubReq) GetEndTime() string {
	if m != nil {
		return m.EndTime
	}
	return ""
}

func (m *PubReq) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

func (m *PubReq) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func (m *PubReq) GetTag() []string {
	if m != nil {
		return m.Tag
	}
	return nil
}

type PubResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PubResp) Reset()         { *m = PubResp{} }
func (m *PubResp) String() string { return proto.CompactTextString(m) }
func (*PubResp) ProtoMessage()    {}
func (*PubResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_970235c7b4e4341e, []int{1}
}

func (m *PubResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PubResp.Unmarshal(m, b)
}
func (m *PubResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PubResp.Marshal(b, m, deterministic)
}
func (m *PubResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PubResp.Merge(m, src)
}
func (m *PubResp) XXX_Size() int {
	return xxx_messageInfo_PubResp.Size(m)
}
func (m *PubResp) XXX_DiscardUnknown() {
	xxx_messageInfo_PubResp.DiscardUnknown(m)
}

var xxx_messageInfo_PubResp proto.InternalMessageInfo

func (m *PubResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *PubResp) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func init() {
	proto.RegisterType((*PubReq)(nil), "activity.PubReq")
	proto.RegisterType((*PubResp)(nil), "activity.PubResp")
}

func init() { proto.RegisterFile("proto/activity.proto", fileDescriptor_970235c7b4e4341e) }

var fileDescriptor_970235c7b4e4341e = []byte{
	// 231 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x64, 0x90, 0xc1, 0x4a, 0xc3, 0x40,
	0x10, 0x86, 0xdd, 0xa6, 0xd9, 0xb4, 0xe3, 0xa5, 0x0e, 0x45, 0x16, 0x0f, 0xb2, 0xe4, 0x94, 0x53,
	0x15, 0xbd, 0x7a, 0x11, 0x5f, 0x40, 0x16, 0x5f, 0x60, 0x9b, 0x0c, 0xba, 0x50, 0x9b, 0x35, 0x3b,
	0x15, 0xfa, 0x62, 0x3e, 0x9f, 0x64, 0x92, 0x4a, 0x89, 0xb7, 0xfd, 0xbe, 0x1f, 0xfe, 0x1d, 0x7e,
	0x58, 0xc7, 0xae, 0xe5, 0xf6, 0xce, 0xd7, 0x1c, 0xbe, 0x03, 0x1f, 0x37, 0x82, 0xb8, 0x38, 0x71,
	0xf9, 0xa3, 0x40, 0xbf, 0x1e, 0xb6, 0x8e, 0xbe, 0x70, 0x0d, 0x79, 0xaf, 0x1b, 0xa3, 0xac, 0xaa,
	0x72, 0x37, 0x00, 0x22, 0xcc, 0xf9, 0x18, 0xc9, 0xcc, 0xac, 0xaa, 0x96, 0x4e, 0xde, 0x78, 0x0b,
	0x50, 0x77, 0xe4, 0x99, 0xde, 0xc2, 0x27, 0x99, 0x4c, 0x92, 0x33, 0x83, 0x06, 0x0a, 0xda, 0x37,
	0x12, 0xce, 0x25, 0x3c, 0x61, 0xff, 0x07, 0x07, 0xde, 0x91, 0xc9, 0xc5, 0x0f, 0x80, 0x16, 0x2e,
	0x1b, 0x4a, 0x75, 0x17, 0x22, 0x87, 0x76, 0x6f, 0xb4, 0x64, 0xe7, 0x0a, 0x57, 0x90, 0xb1, 0x7f,
	0x37, 0x85, 0xcd, 0xaa, 0xa5, 0xeb, 0x9f, 0xe5, 0x0b, 0x14, 0x72, 0x77, 0x8a, 0x78, 0x0d, 0x3a,
	0xb1, 0xe7, 0x43, 0x1a, 0x2f, 0x1f, 0x69, 0x5a, 0x3b, 0xfb, 0x57, 0xfb, 0xf0, 0x04, 0x8b, 0xe7,
	0x71, 0x09, 0xbc, 0x97, 0xc2, 0x5d, 0x48, 0x1f, 0xb8, 0xda, 0xfc, 0xed, 0x35, 0x6c, 0x73, 0x73,
	0x35, 0x31, 0x29, 0x96, 0x17, 0x5b, 0x2d, 0x63, 0x3e, 0xfe, 0x06, 0x00, 0x00, 0xff, 0xff, 0x07,
	0xe7, 0x45, 0x46, 0x64, 0x01, 0x00, 0x00,
}
