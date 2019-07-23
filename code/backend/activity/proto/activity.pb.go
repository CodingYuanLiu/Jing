// Code generated by protoc-gen-go. DO NOT EDIT.
// source: activity.proto

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

type BasicInfo struct {
	Type                 string   `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
	CreateTime           string   `protobuf:"bytes,3,opt,name=createTime,proto3" json:"createTime,omitempty"`
	EndTime              string   `protobuf:"bytes,4,opt,name=endTime,proto3" json:"endTime,omitempty"`
	Title                string   `protobuf:"bytes,5,opt,name=title,proto3" json:"title,omitempty"`
	Description          string   `protobuf:"bytes,6,opt,name=description,proto3" json:"description,omitempty"`
	Tag                  []string `protobuf:"bytes,7,rep,name=tag,proto3" json:"tag,omitempty"`
	Images               []string `protobuf:"bytes,8,rep,name=images,proto3" json:"images,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *BasicInfo) Reset()         { *m = BasicInfo{} }
func (m *BasicInfo) String() string { return proto.CompactTextString(m) }
func (*BasicInfo) ProtoMessage()    {}
func (*BasicInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{0}
}

func (m *BasicInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_BasicInfo.Unmarshal(m, b)
}
func (m *BasicInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_BasicInfo.Marshal(b, m, deterministic)
}
func (m *BasicInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BasicInfo.Merge(m, src)
}
func (m *BasicInfo) XXX_Size() int {
	return xxx_messageInfo_BasicInfo.Size(m)
}
func (m *BasicInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_BasicInfo.DiscardUnknown(m)
}

var xxx_messageInfo_BasicInfo proto.InternalMessageInfo

func (m *BasicInfo) GetType() string {
	if m != nil {
		return m.Type
	}
	return ""
}

func (m *BasicInfo) GetCreateTime() string {
	if m != nil {
		return m.CreateTime
	}
	return ""
}

func (m *BasicInfo) GetEndTime() string {
	if m != nil {
		return m.EndTime
	}
	return ""
}

func (m *BasicInfo) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

func (m *BasicInfo) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func (m *BasicInfo) GetTag() []string {
	if m != nil {
		return m.Tag
	}
	return nil
}

func (m *BasicInfo) GetImages() []string {
	if m != nil {
		return m.Images
	}
	return nil
}

type PubReq struct {
	Info                 *BasicInfo   `protobuf:"bytes,3,opt,name=info,proto3" json:"info,omitempty"`
	TaxiInfo             *TaxiInfo    `protobuf:"bytes,4,opt,name=taxiInfo,proto3" json:"taxiInfo,omitempty"`
	TakeoutInfo          *TakeoutInfo `protobuf:"bytes,5,opt,name=takeoutInfo,proto3" json:"takeoutInfo,omitempty"`
	OrderInfo            *OrderInfo   `protobuf:"bytes,6,opt,name=orderInfo,proto3" json:"orderInfo,omitempty"`
	OtherInfo            *OtherInfo   `protobuf:"bytes,7,opt,name=otherInfo,proto3" json:"otherInfo,omitempty"`
	XXX_NoUnkeyedLiteral struct{}     `json:"-"`
	XXX_unrecognized     []byte       `json:"-"`
	XXX_sizecache        int32        `json:"-"`
}

func (m *PubReq) Reset()         { *m = PubReq{} }
func (m *PubReq) String() string { return proto.CompactTextString(m) }
func (*PubReq) ProtoMessage()    {}
func (*PubReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{1}
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

func (m *PubReq) GetInfo() *BasicInfo {
	if m != nil {
		return m.Info
	}
	return nil
}

func (m *PubReq) GetTaxiInfo() *TaxiInfo {
	if m != nil {
		return m.TaxiInfo
	}
	return nil
}

func (m *PubReq) GetTakeoutInfo() *TakeoutInfo {
	if m != nil {
		return m.TakeoutInfo
	}
	return nil
}

func (m *PubReq) GetOrderInfo() *OrderInfo {
	if m != nil {
		return m.OrderInfo
	}
	return nil
}

func (m *PubReq) GetOtherInfo() *OtherInfo {
	if m != nil {
		return m.OtherInfo
	}
	return nil
}

type PubResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	ActId                int32    `protobuf:"varint,3,opt,name=actId,proto3" json:"actId,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PubResp) Reset()         { *m = PubResp{} }
func (m *PubResp) String() string { return proto.CompactTextString(m) }
func (*PubResp) ProtoMessage()    {}
func (*PubResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{2}
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

func (m *PubResp) GetActId() int32 {
	if m != nil {
		return m.ActId
	}
	return 0
}

type MdfReq struct {
	ActId                int32        `protobuf:"varint,1,opt,name=actId,proto3" json:"actId,omitempty"`
	CreateTime           string       `protobuf:"bytes,2,opt,name=createTime,proto3" json:"createTime,omitempty"`
	EndTime              string       `protobuf:"bytes,3,opt,name=endTime,proto3" json:"endTime,omitempty"`
	Description          string       `protobuf:"bytes,4,opt,name=description,proto3" json:"description,omitempty"`
	Tag                  []string     `protobuf:"bytes,5,rep,name=tag,proto3" json:"tag,omitempty"`
	TaxiInfo             *TaxiInfo    `protobuf:"bytes,6,opt,name=taxiInfo,proto3" json:"taxiInfo,omitempty"`
	TakeoutInfo          *TakeoutInfo `protobuf:"bytes,7,opt,name=takeoutInfo,proto3" json:"takeoutInfo,omitempty"`
	OrderInfo            *OrderInfo   `protobuf:"bytes,8,opt,name=orderInfo,proto3" json:"orderInfo,omitempty"`
	OtherInfo            *OtherInfo   `protobuf:"bytes,9,opt,name=otherInfo,proto3" json:"otherInfo,omitempty"`
	XXX_NoUnkeyedLiteral struct{}     `json:"-"`
	XXX_unrecognized     []byte       `json:"-"`
	XXX_sizecache        int32        `json:"-"`
}

func (m *MdfReq) Reset()         { *m = MdfReq{} }
func (m *MdfReq) String() string { return proto.CompactTextString(m) }
func (*MdfReq) ProtoMessage()    {}
func (*MdfReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{3}
}

func (m *MdfReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_MdfReq.Unmarshal(m, b)
}
func (m *MdfReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_MdfReq.Marshal(b, m, deterministic)
}
func (m *MdfReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MdfReq.Merge(m, src)
}
func (m *MdfReq) XXX_Size() int {
	return xxx_messageInfo_MdfReq.Size(m)
}
func (m *MdfReq) XXX_DiscardUnknown() {
	xxx_messageInfo_MdfReq.DiscardUnknown(m)
}

var xxx_messageInfo_MdfReq proto.InternalMessageInfo

func (m *MdfReq) GetActId() int32 {
	if m != nil {
		return m.ActId
	}
	return 0
}

func (m *MdfReq) GetCreateTime() string {
	if m != nil {
		return m.CreateTime
	}
	return ""
}

func (m *MdfReq) GetEndTime() string {
	if m != nil {
		return m.EndTime
	}
	return ""
}

func (m *MdfReq) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func (m *MdfReq) GetTag() []string {
	if m != nil {
		return m.Tag
	}
	return nil
}

func (m *MdfReq) GetTaxiInfo() *TaxiInfo {
	if m != nil {
		return m.TaxiInfo
	}
	return nil
}

func (m *MdfReq) GetTakeoutInfo() *TakeoutInfo {
	if m != nil {
		return m.TakeoutInfo
	}
	return nil
}

func (m *MdfReq) GetOrderInfo() *OrderInfo {
	if m != nil {
		return m.OrderInfo
	}
	return nil
}

func (m *MdfReq) GetOtherInfo() *OtherInfo {
	if m != nil {
		return m.OtherInfo
	}
	return nil
}

type MdfResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *MdfResp) Reset()         { *m = MdfResp{} }
func (m *MdfResp) String() string { return proto.CompactTextString(m) }
func (*MdfResp) ProtoMessage()    {}
func (*MdfResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{4}
}

func (m *MdfResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_MdfResp.Unmarshal(m, b)
}
func (m *MdfResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_MdfResp.Marshal(b, m, deterministic)
}
func (m *MdfResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MdfResp.Merge(m, src)
}
func (m *MdfResp) XXX_Size() int {
	return xxx_messageInfo_MdfResp.Size(m)
}
func (m *MdfResp) XXX_DiscardUnknown() {
	xxx_messageInfo_MdfResp.DiscardUnknown(m)
}

var xxx_messageInfo_MdfResp proto.InternalMessageInfo

func (m *MdfResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *MdfResp) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

type DltReq struct {
	ActId                int32    `protobuf:"varint,1,opt,name=actId,proto3" json:"actId,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *DltReq) Reset()         { *m = DltReq{} }
func (m *DltReq) String() string { return proto.CompactTextString(m) }
func (*DltReq) ProtoMessage()    {}
func (*DltReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{5}
}

func (m *DltReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_DltReq.Unmarshal(m, b)
}
func (m *DltReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_DltReq.Marshal(b, m, deterministic)
}
func (m *DltReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DltReq.Merge(m, src)
}
func (m *DltReq) XXX_Size() int {
	return xxx_messageInfo_DltReq.Size(m)
}
func (m *DltReq) XXX_DiscardUnknown() {
	xxx_messageInfo_DltReq.DiscardUnknown(m)
}

var xxx_messageInfo_DltReq proto.InternalMessageInfo

func (m *DltReq) GetActId() int32 {
	if m != nil {
		return m.ActId
	}
	return 0
}

type DltResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *DltResp) Reset()         { *m = DltResp{} }
func (m *DltResp) String() string { return proto.CompactTextString(m) }
func (*DltResp) ProtoMessage()    {}
func (*DltResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{6}
}

func (m *DltResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_DltResp.Unmarshal(m, b)
}
func (m *DltResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_DltResp.Marshal(b, m, deterministic)
}
func (m *DltResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DltResp.Merge(m, src)
}
func (m *DltResp) XXX_Size() int {
	return xxx_messageInfo_DltResp.Size(m)
}
func (m *DltResp) XXX_DiscardUnknown() {
	xxx_messageInfo_DltResp.DiscardUnknown(m)
}

var xxx_messageInfo_DltResp proto.InternalMessageInfo

func (m *DltResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *DltResp) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

type QryReq struct {
	ActId                int32    `protobuf:"varint,1,opt,name=actId,proto3" json:"actId,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *QryReq) Reset()         { *m = QryReq{} }
func (m *QryReq) String() string { return proto.CompactTextString(m) }
func (*QryReq) ProtoMessage()    {}
func (*QryReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{7}
}

func (m *QryReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_QryReq.Unmarshal(m, b)
}
func (m *QryReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_QryReq.Marshal(b, m, deterministic)
}
func (m *QryReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_QryReq.Merge(m, src)
}
func (m *QryReq) XXX_Size() int {
	return xxx_messageInfo_QryReq.Size(m)
}
func (m *QryReq) XXX_DiscardUnknown() {
	xxx_messageInfo_QryReq.DiscardUnknown(m)
}

var xxx_messageInfo_QryReq proto.InternalMessageInfo

func (m *QryReq) GetActId() int32 {
	if m != nil {
		return m.ActId
	}
	return 0
}

type QryResp struct {
	Status               int32        `protobuf:"varint,6,opt,name=status,proto3" json:"status,omitempty"`
	BasicInfo            *BasicInfo   `protobuf:"bytes,1,opt,name=basicInfo,proto3" json:"basicInfo,omitempty"`
	TaxiInfo             *TaxiInfo    `protobuf:"bytes,2,opt,name=taxiInfo,proto3" json:"taxiInfo,omitempty"`
	TakeoutInfo          *TakeoutInfo `protobuf:"bytes,3,opt,name=takeoutInfo,proto3" json:"takeoutInfo,omitempty"`
	OrderInfo            *OrderInfo   `protobuf:"bytes,4,opt,name=orderInfo,proto3" json:"orderInfo,omitempty"`
	OtherInfo            *OtherInfo   `protobuf:"bytes,5,opt,name=otherInfo,proto3" json:"otherInfo,omitempty"`
	Comments             []*Comment   `protobuf:"bytes,7,rep,name=comments,proto3" json:"comments,omitempty"`
	XXX_NoUnkeyedLiteral struct{}     `json:"-"`
	XXX_unrecognized     []byte       `json:"-"`
	XXX_sizecache        int32        `json:"-"`
}

func (m *QryResp) Reset()         { *m = QryResp{} }
func (m *QryResp) String() string { return proto.CompactTextString(m) }
func (*QryResp) ProtoMessage()    {}
func (*QryResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{8}
}

func (m *QryResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_QryResp.Unmarshal(m, b)
}
func (m *QryResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_QryResp.Marshal(b, m, deterministic)
}
func (m *QryResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_QryResp.Merge(m, src)
}
func (m *QryResp) XXX_Size() int {
	return xxx_messageInfo_QryResp.Size(m)
}
func (m *QryResp) XXX_DiscardUnknown() {
	xxx_messageInfo_QryResp.DiscardUnknown(m)
}

var xxx_messageInfo_QryResp proto.InternalMessageInfo

func (m *QryResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *QryResp) GetBasicInfo() *BasicInfo {
	if m != nil {
		return m.BasicInfo
	}
	return nil
}

func (m *QryResp) GetTaxiInfo() *TaxiInfo {
	if m != nil {
		return m.TaxiInfo
	}
	return nil
}

func (m *QryResp) GetTakeoutInfo() *TakeoutInfo {
	if m != nil {
		return m.TakeoutInfo
	}
	return nil
}

func (m *QryResp) GetOrderInfo() *OrderInfo {
	if m != nil {
		return m.OrderInfo
	}
	return nil
}

func (m *QryResp) GetOtherInfo() *OtherInfo {
	if m != nil {
		return m.OtherInfo
	}
	return nil
}

func (m *QryResp) GetComments() []*Comment {
	if m != nil {
		return m.Comments
	}
	return nil
}

type TaxiInfo struct {
	DepartTime           string   `protobuf:"bytes,1,opt,name=departTime,proto3" json:"departTime,omitempty"`
	Origin               []byte   `protobuf:"bytes,2,opt,name=origin,proto3" json:"origin,omitempty"`
	Destination          []byte   `protobuf:"bytes,3,opt,name=destination,proto3" json:"destination,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TaxiInfo) Reset()         { *m = TaxiInfo{} }
func (m *TaxiInfo) String() string { return proto.CompactTextString(m) }
func (*TaxiInfo) ProtoMessage()    {}
func (*TaxiInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{9}
}

func (m *TaxiInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TaxiInfo.Unmarshal(m, b)
}
func (m *TaxiInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TaxiInfo.Marshal(b, m, deterministic)
}
func (m *TaxiInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TaxiInfo.Merge(m, src)
}
func (m *TaxiInfo) XXX_Size() int {
	return xxx_messageInfo_TaxiInfo.Size(m)
}
func (m *TaxiInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_TaxiInfo.DiscardUnknown(m)
}

var xxx_messageInfo_TaxiInfo proto.InternalMessageInfo

func (m *TaxiInfo) GetDepartTime() string {
	if m != nil {
		return m.DepartTime
	}
	return ""
}

func (m *TaxiInfo) GetOrigin() []byte {
	if m != nil {
		return m.Origin
	}
	return nil
}

func (m *TaxiInfo) GetDestination() []byte {
	if m != nil {
		return m.Destination
	}
	return nil
}

type TakeoutInfo struct {
	Store                string   `protobuf:"bytes,1,opt,name=store,proto3" json:"store,omitempty"`
	OrderTime            string   `protobuf:"bytes,2,opt,name=orderTime,proto3" json:"orderTime,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TakeoutInfo) Reset()         { *m = TakeoutInfo{} }
func (m *TakeoutInfo) String() string { return proto.CompactTextString(m) }
func (*TakeoutInfo) ProtoMessage()    {}
func (*TakeoutInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{10}
}

func (m *TakeoutInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TakeoutInfo.Unmarshal(m, b)
}
func (m *TakeoutInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TakeoutInfo.Marshal(b, m, deterministic)
}
func (m *TakeoutInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TakeoutInfo.Merge(m, src)
}
func (m *TakeoutInfo) XXX_Size() int {
	return xxx_messageInfo_TakeoutInfo.Size(m)
}
func (m *TakeoutInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_TakeoutInfo.DiscardUnknown(m)
}

var xxx_messageInfo_TakeoutInfo proto.InternalMessageInfo

func (m *TakeoutInfo) GetStore() string {
	if m != nil {
		return m.Store
	}
	return ""
}

func (m *TakeoutInfo) GetOrderTime() string {
	if m != nil {
		return m.OrderTime
	}
	return ""
}

type OrderInfo struct {
	Store                string   `protobuf:"bytes,1,opt,name=store,proto3" json:"store,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *OrderInfo) Reset()         { *m = OrderInfo{} }
func (m *OrderInfo) String() string { return proto.CompactTextString(m) }
func (*OrderInfo) ProtoMessage()    {}
func (*OrderInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{11}
}

func (m *OrderInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_OrderInfo.Unmarshal(m, b)
}
func (m *OrderInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_OrderInfo.Marshal(b, m, deterministic)
}
func (m *OrderInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_OrderInfo.Merge(m, src)
}
func (m *OrderInfo) XXX_Size() int {
	return xxx_messageInfo_OrderInfo.Size(m)
}
func (m *OrderInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_OrderInfo.DiscardUnknown(m)
}

var xxx_messageInfo_OrderInfo proto.InternalMessageInfo

func (m *OrderInfo) GetStore() string {
	if m != nil {
		return m.Store
	}
	return ""
}

type OtherInfo struct {
	ActivityTime         string   `protobuf:"bytes,1,opt,name=activityTime,proto3" json:"activityTime,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *OtherInfo) Reset()         { *m = OtherInfo{} }
func (m *OtherInfo) String() string { return proto.CompactTextString(m) }
func (*OtherInfo) ProtoMessage()    {}
func (*OtherInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{12}
}

func (m *OtherInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_OtherInfo.Unmarshal(m, b)
}
func (m *OtherInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_OtherInfo.Marshal(b, m, deterministic)
}
func (m *OtherInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_OtherInfo.Merge(m, src)
}
func (m *OtherInfo) XXX_Size() int {
	return xxx_messageInfo_OtherInfo.Size(m)
}
func (m *OtherInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_OtherInfo.DiscardUnknown(m)
}

var xxx_messageInfo_OtherInfo proto.InternalMessageInfo

func (m *OtherInfo) GetActivityTime() string {
	if m != nil {
		return m.ActivityTime
	}
	return ""
}

type CmtReq struct {
	ActId                int32    `protobuf:"varint,1,opt,name=actId,proto3" json:"actId,omitempty"`
	UserId               int32    `protobuf:"varint,2,opt,name=userId,proto3" json:"userId,omitempty"`
	ReceiverId           int32    `protobuf:"varint,4,opt,name=receiverId,proto3" json:"receiverId,omitempty"`
	Content              string   `protobuf:"bytes,3,opt,name=content,proto3" json:"content,omitempty"`
	Time                 string   `protobuf:"bytes,5,opt,name=time,proto3" json:"time,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CmtReq) Reset()         { *m = CmtReq{} }
func (m *CmtReq) String() string { return proto.CompactTextString(m) }
func (*CmtReq) ProtoMessage()    {}
func (*CmtReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{13}
}

func (m *CmtReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CmtReq.Unmarshal(m, b)
}
func (m *CmtReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CmtReq.Marshal(b, m, deterministic)
}
func (m *CmtReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CmtReq.Merge(m, src)
}
func (m *CmtReq) XXX_Size() int {
	return xxx_messageInfo_CmtReq.Size(m)
}
func (m *CmtReq) XXX_DiscardUnknown() {
	xxx_messageInfo_CmtReq.DiscardUnknown(m)
}

var xxx_messageInfo_CmtReq proto.InternalMessageInfo

func (m *CmtReq) GetActId() int32 {
	if m != nil {
		return m.ActId
	}
	return 0
}

func (m *CmtReq) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *CmtReq) GetReceiverId() int32 {
	if m != nil {
		return m.ReceiverId
	}
	return 0
}

func (m *CmtReq) GetContent() string {
	if m != nil {
		return m.Content
	}
	return ""
}

func (m *CmtReq) GetTime() string {
	if m != nil {
		return m.Time
	}
	return ""
}

type CmtResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CmtResp) Reset()         { *m = CmtResp{} }
func (m *CmtResp) String() string { return proto.CompactTextString(m) }
func (*CmtResp) ProtoMessage()    {}
func (*CmtResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{14}
}

func (m *CmtResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CmtResp.Unmarshal(m, b)
}
func (m *CmtResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CmtResp.Marshal(b, m, deterministic)
}
func (m *CmtResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CmtResp.Merge(m, src)
}
func (m *CmtResp) XXX_Size() int {
	return xxx_messageInfo_CmtResp.Size(m)
}
func (m *CmtResp) XXX_DiscardUnknown() {
	xxx_messageInfo_CmtResp.DiscardUnknown(m)
}

var xxx_messageInfo_CmtResp proto.InternalMessageInfo

func (m *CmtResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *CmtResp) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

type Comment struct {
	UserId               int32    `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	ReceiverId           int32    `protobuf:"varint,2,opt,name=receiverId,proto3" json:"receiverId,omitempty"`
	Content              string   `protobuf:"bytes,3,opt,name=content,proto3" json:"content,omitempty"`
	Time                 string   `protobuf:"bytes,4,opt,name=time,proto3" json:"time,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Comment) Reset()         { *m = Comment{} }
func (m *Comment) String() string { return proto.CompactTextString(m) }
func (*Comment) ProtoMessage()    {}
func (*Comment) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{15}
}

func (m *Comment) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Comment.Unmarshal(m, b)
}
func (m *Comment) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Comment.Marshal(b, m, deterministic)
}
func (m *Comment) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Comment.Merge(m, src)
}
func (m *Comment) XXX_Size() int {
	return xxx_messageInfo_Comment.Size(m)
}
func (m *Comment) XXX_DiscardUnknown() {
	xxx_messageInfo_Comment.DiscardUnknown(m)
}

var xxx_messageInfo_Comment proto.InternalMessageInfo

func (m *Comment) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *Comment) GetReceiverId() int32 {
	if m != nil {
		return m.ReceiverId
	}
	return 0
}

func (m *Comment) GetContent() string {
	if m != nil {
		return m.Content
	}
	return ""
}

func (m *Comment) GetTime() string {
	if m != nil {
		return m.Time
	}
	return ""
}

type TagReq struct {
	Title                string   `protobuf:"bytes,1,opt,name=title,proto3" json:"title,omitempty"`
	Description          string   `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TagReq) Reset()         { *m = TagReq{} }
func (m *TagReq) String() string { return proto.CompactTextString(m) }
func (*TagReq) ProtoMessage()    {}
func (*TagReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{16}
}

func (m *TagReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TagReq.Unmarshal(m, b)
}
func (m *TagReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TagReq.Marshal(b, m, deterministic)
}
func (m *TagReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TagReq.Merge(m, src)
}
func (m *TagReq) XXX_Size() int {
	return xxx_messageInfo_TagReq.Size(m)
}
func (m *TagReq) XXX_DiscardUnknown() {
	xxx_messageInfo_TagReq.DiscardUnknown(m)
}

var xxx_messageInfo_TagReq proto.InternalMessageInfo

func (m *TagReq) GetTitle() string {
	if m != nil {
		return m.Title
	}
	return ""
}

func (m *TagReq) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

type TagResp struct {
	Status               int32    `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	Tag                  []string `protobuf:"bytes,2,rep,name=tag,proto3" json:"tag,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TagResp) Reset()         { *m = TagResp{} }
func (m *TagResp) String() string { return proto.CompactTextString(m) }
func (*TagResp) ProtoMessage()    {}
func (*TagResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{17}
}

func (m *TagResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TagResp.Unmarshal(m, b)
}
func (m *TagResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TagResp.Marshal(b, m, deterministic)
}
func (m *TagResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TagResp.Merge(m, src)
}
func (m *TagResp) XXX_Size() int {
	return xxx_messageInfo_TagResp.Size(m)
}
func (m *TagResp) XXX_DiscardUnknown() {
	xxx_messageInfo_TagResp.DiscardUnknown(m)
}

var xxx_messageInfo_TagResp proto.InternalMessageInfo

func (m *TagResp) GetStatus() int32 {
	if m != nil {
		return m.Status
	}
	return 0
}

func (m *TagResp) GetTag() []string {
	if m != nil {
		return m.Tag
	}
	return nil
}

type AddTagsReq struct {
	Tags                 []string `protobuf:"bytes,1,rep,name=tags,proto3" json:"tags,omitempty"`
	UserId               int32    `protobuf:"varint,2,opt,name=userId,proto3" json:"userId,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *AddTagsReq) Reset()         { *m = AddTagsReq{} }
func (m *AddTagsReq) String() string { return proto.CompactTextString(m) }
func (*AddTagsReq) ProtoMessage()    {}
func (*AddTagsReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{18}
}

func (m *AddTagsReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AddTagsReq.Unmarshal(m, b)
}
func (m *AddTagsReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AddTagsReq.Marshal(b, m, deterministic)
}
func (m *AddTagsReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AddTagsReq.Merge(m, src)
}
func (m *AddTagsReq) XXX_Size() int {
	return xxx_messageInfo_AddTagsReq.Size(m)
}
func (m *AddTagsReq) XXX_DiscardUnknown() {
	xxx_messageInfo_AddTagsReq.DiscardUnknown(m)
}

var xxx_messageInfo_AddTagsReq proto.InternalMessageInfo

func (m *AddTagsReq) GetTags() []string {
	if m != nil {
		return m.Tags
	}
	return nil
}

func (m *AddTagsReq) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

type AddTagsResp struct {
	Num                  int32    `protobuf:"varint,1,opt,name=num,proto3" json:"num,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *AddTagsResp) Reset()         { *m = AddTagsResp{} }
func (m *AddTagsResp) String() string { return proto.CompactTextString(m) }
func (*AddTagsResp) ProtoMessage()    {}
func (*AddTagsResp) Descriptor() ([]byte, []int) {
	return fileDescriptor_a684c9a0549e7832, []int{19}
}

func (m *AddTagsResp) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AddTagsResp.Unmarshal(m, b)
}
func (m *AddTagsResp) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AddTagsResp.Marshal(b, m, deterministic)
}
func (m *AddTagsResp) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AddTagsResp.Merge(m, src)
}
func (m *AddTagsResp) XXX_Size() int {
	return xxx_messageInfo_AddTagsResp.Size(m)
}
func (m *AddTagsResp) XXX_DiscardUnknown() {
	xxx_messageInfo_AddTagsResp.DiscardUnknown(m)
}

var xxx_messageInfo_AddTagsResp proto.InternalMessageInfo

func (m *AddTagsResp) GetNum() int32 {
	if m != nil {
		return m.Num
	}
	return 0
}

func init() {
	proto.RegisterType((*BasicInfo)(nil), "activity.BasicInfo")
	proto.RegisterType((*PubReq)(nil), "activity.PubReq")
	proto.RegisterType((*PubResp)(nil), "activity.PubResp")
	proto.RegisterType((*MdfReq)(nil), "activity.MdfReq")
	proto.RegisterType((*MdfResp)(nil), "activity.MdfResp")
	proto.RegisterType((*DltReq)(nil), "activity.DltReq")
	proto.RegisterType((*DltResp)(nil), "activity.DltResp")
	proto.RegisterType((*QryReq)(nil), "activity.QryReq")
	proto.RegisterType((*QryResp)(nil), "activity.QryResp")
	proto.RegisterType((*TaxiInfo)(nil), "activity.TaxiInfo")
	proto.RegisterType((*TakeoutInfo)(nil), "activity.TakeoutInfo")
	proto.RegisterType((*OrderInfo)(nil), "activity.OrderInfo")
	proto.RegisterType((*OtherInfo)(nil), "activity.OtherInfo")
	proto.RegisterType((*CmtReq)(nil), "activity.CmtReq")
	proto.RegisterType((*CmtResp)(nil), "activity.CmtResp")
	proto.RegisterType((*Comment)(nil), "activity.Comment")
	proto.RegisterType((*TagReq)(nil), "activity.TagReq")
	proto.RegisterType((*TagResp)(nil), "activity.TagResp")
	proto.RegisterType((*AddTagsReq)(nil), "activity.AddTagsReq")
	proto.RegisterType((*AddTagsResp)(nil), "activity.AddTagsResp")
}

func init() { proto.RegisterFile("activity.proto", fileDescriptor_a684c9a0549e7832) }

var fileDescriptor_a684c9a0549e7832 = []byte{
	// 812 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xa4, 0x56, 0xcf, 0x6e, 0xd3, 0x4e,
	0x10, 0x8e, 0x9d, 0xd8, 0x8e, 0xc7, 0xd5, 0x4f, 0xed, 0xfe, 0x5a, 0x64, 0x55, 0xa8, 0x84, 0xbd,
	0xd0, 0x0b, 0x29, 0x4d, 0x0f, 0xf4, 0x48, 0x49, 0x25, 0xd4, 0x43, 0x05, 0x35, 0xb9, 0x70, 0x74,
	0xed, 0x4d, 0xba, 0x22, 0xb1, 0x83, 0xbd, 0xa9, 0xc8, 0x8d, 0x03, 0x6f, 0xc5, 0x5b, 0x70, 0xe5,
	0x21, 0x78, 0x05, 0xb4, 0xe3, 0xb5, 0xbd, 0x49, 0x9b, 0xa8, 0x69, 0x6f, 0x99, 0x3f, 0x9f, 0x67,
	0xf6, 0xfb, 0x66, 0x67, 0x03, 0xff, 0x85, 0x91, 0xe0, 0xb7, 0x5c, 0xcc, 0xbb, 0xd3, 0x2c, 0x15,
	0x29, 0x69, 0x97, 0x36, 0xfd, 0x65, 0x80, 0xfb, 0x3e, 0xcc, 0x79, 0x74, 0x91, 0x0c, 0x53, 0x42,
	0xa0, 0x25, 0xe6, 0x53, 0xe6, 0x9b, 0x1d, 0xe3, 0xd0, 0x0d, 0xf0, 0x37, 0x39, 0x00, 0x88, 0x32,
	0x16, 0x0a, 0x36, 0xe0, 0x13, 0xe6, 0x37, 0x31, 0xa2, 0x79, 0x88, 0x0f, 0x0e, 0x4b, 0x62, 0x0c,
	0xb6, 0x30, 0x58, 0x9a, 0x64, 0x17, 0x2c, 0xc1, 0xc5, 0x98, 0xf9, 0x16, 0xfa, 0x0b, 0x83, 0x74,
	0xc0, 0x8b, 0x59, 0x1e, 0x65, 0x7c, 0x2a, 0x78, 0x9a, 0xf8, 0x36, 0xc6, 0x74, 0x17, 0xd9, 0x86,
	0xa6, 0x08, 0x47, 0xbe, 0xd3, 0x69, 0x1e, 0xba, 0x81, 0xfc, 0x49, 0x9e, 0x81, 0xcd, 0x27, 0xe1,
	0x88, 0xe5, 0x7e, 0x1b, 0x9d, 0xca, 0xa2, 0x3f, 0x4c, 0xb0, 0x3f, 0xcd, 0xae, 0x03, 0xf6, 0x8d,
	0xbc, 0x82, 0x16, 0x4f, 0x86, 0x29, 0x36, 0xe8, 0xf5, 0xfe, 0xef, 0x56, 0x27, 0xae, 0x4e, 0x17,
	0x60, 0x02, 0xe9, 0x42, 0x5b, 0x84, 0xdf, 0xb9, 0xf4, 0x60, 0xc3, 0x5e, 0x8f, 0xd4, 0xc9, 0x03,
	0x15, 0x09, 0xaa, 0x1c, 0xf2, 0x16, 0x3c, 0x11, 0x7e, 0x65, 0xe9, 0x4c, 0x20, 0xc4, 0x42, 0xc8,
	0x9e, 0x0e, 0xa9, 0x82, 0x81, 0x9e, 0x49, 0x8e, 0xc1, 0x4d, 0xb3, 0x98, 0x65, 0x08, 0xb3, 0x97,
	0xdb, 0xfa, 0x58, 0x86, 0x82, 0x3a, 0x0b, 0x21, 0xe2, 0x46, 0x41, 0x9c, 0x3b, 0x90, 0x32, 0x14,
	0xd4, 0x59, 0xf4, 0x0b, 0x38, 0xc8, 0x40, 0x3e, 0x95, 0x2c, 0xe5, 0x22, 0x14, 0xb3, 0xdc, 0x37,
	0x3a, 0xc6, 0xa1, 0x15, 0x28, 0x6b, 0x99, 0x71, 0xf3, 0x2e, 0xe3, 0xbb, 0x60, 0x85, 0x91, 0xb8,
	0x88, 0x91, 0x3d, 0x2b, 0x28, 0x0c, 0xfa, 0xc7, 0x04, 0xfb, 0x32, 0x1e, 0x4a, 0x76, 0xab, 0x04,
	0x43, 0x4b, 0x58, 0x1a, 0x0d, 0x73, 0xdd, 0x68, 0x34, 0x17, 0x47, 0x63, 0xa9, 0xa5, 0xd6, 0xca,
	0x21, 0xb0, 0xea, 0x21, 0xd0, 0x85, 0xb3, 0x37, 0x17, 0xce, 0x79, 0x9c, 0x70, 0xed, 0xcd, 0x85,
	0x73, 0x1f, 0x24, 0x5c, 0x1f, 0x1c, 0x24, 0xf7, 0x29, 0xc2, 0xd1, 0x03, 0xb0, 0xcf, 0xc7, 0x62,
	0xa5, 0x42, 0xb2, 0x08, 0xc6, 0x9f, 0x5a, 0xe4, 0x2a, 0x9b, 0xaf, 0x2e, 0xf2, 0xdb, 0x04, 0x07,
	0x13, 0x16, 0xaa, 0xd8, 0x0b, 0x55, 0x8e, 0xc1, 0xbd, 0x2e, 0x2f, 0x22, 0xa2, 0x57, 0xdc, 0xd1,
	0x3a, 0x6b, 0x41, 0x6f, 0x73, 0x73, 0xbd, 0x9b, 0x8f, 0xd3, 0xbb, 0xb5, 0xb9, 0xde, 0xd6, 0x43,
	0xf4, 0x26, 0xaf, 0xa1, 0x1d, 0xa5, 0x93, 0x09, 0x4b, 0x44, 0x8e, 0xab, 0xcd, 0xeb, 0xed, 0xd4,
	0x88, 0x7e, 0x11, 0x09, 0xaa, 0x14, 0x1a, 0x43, 0xbb, 0x3c, 0xa3, 0xbc, 0x67, 0x31, 0x9b, 0x86,
	0x99, 0xc0, 0xab, 0x64, 0x14, 0xf7, 0xac, 0xf6, 0x48, 0xd2, 0xd3, 0x8c, 0x8f, 0x78, 0xa1, 0xde,
	0x56, 0xa0, 0x2c, 0x25, 0xad, 0xe0, 0x49, 0x88, 0xd2, 0x36, 0x31, 0xa8, 0xbb, 0xe8, 0x19, 0x78,
	0x1a, 0x2d, 0x52, 0xdf, 0x5c, 0xa4, 0x59, 0x59, 0xa3, 0x30, 0xc8, 0x73, 0xc5, 0x8f, 0x76, 0xcb,
	0x6b, 0x07, 0x7d, 0x09, 0x6e, 0x45, 0xd1, 0xfd, 0x1f, 0xa0, 0x47, 0xe0, 0x56, 0x94, 0x10, 0x0a,
	0x5b, 0xe5, 0xb1, 0xb5, 0xe3, 0x2c, 0xf8, 0xe8, 0x4f, 0x03, 0xec, 0xfe, 0x64, 0xf5, 0x5c, 0xcb,
	0x13, 0xcf, 0x72, 0x96, 0x5d, 0xc4, 0xd8, 0x8f, 0x15, 0x28, 0x4b, 0x32, 0x95, 0xb1, 0x88, 0xf1,
	0x5b, 0x8c, 0xb5, 0x30, 0xa6, 0x79, 0xe4, 0x46, 0x8a, 0xd2, 0x44, 0xb0, 0x44, 0x94, 0x1b, 0x49,
	0x99, 0xf8, 0xf4, 0xc9, 0x76, 0x2c, 0xf5, 0xf4, 0xc9, 0x36, 0xfa, 0xe0, 0x60, 0x17, 0x4f, 0xba,
	0x3d, 0x29, 0x38, 0x4a, 0x5d, 0xad, 0x6b, 0x63, 0x4d, 0xd7, 0xe6, 0x23, 0xba, 0x6e, 0x69, 0x5d,
	0xbf, 0x03, 0x7b, 0x10, 0x8e, 0x14, 0x77, 0xc5, 0x03, 0x6c, 0xac, 0x79, 0x80, 0xef, 0x69, 0xf9,
	0x04, 0x1c, 0xfc, 0xc2, 0x9a, 0x73, 0xab, 0xf5, 0x6c, 0x56, 0xeb, 0x99, 0x9e, 0x02, 0x9c, 0xc5,
	0xf1, 0x20, 0x1c, 0xe5, 0xb2, 0xb4, 0x6c, 0x2c, 0x1c, 0x49, 0x54, 0x13, 0x1b, 0x0b, 0x47, 0xf9,
	0x2a, 0xd1, 0xe8, 0x0b, 0xf0, 0x2a, 0x64, 0x3e, 0x95, 0x9f, 0x4e, 0x66, 0x13, 0x55, 0x4f, 0xfe,
	0xec, 0xfd, 0x35, 0xc1, 0x3b, 0x53, 0xf3, 0xf1, 0x39, 0xbb, 0x25, 0x6f, 0xf0, 0xcd, 0x1b, 0xf3,
	0xfc, 0x86, 0x6c, 0xd7, 0x77, 0xa8, 0xf8, 0x23, 0xb0, 0xbf, 0xb3, 0xe4, 0xc9, 0xa7, 0xb4, 0x41,
	0x8e, 0xc0, 0xbe, 0x4c, 0x63, 0x3e, 0x9c, 0xeb, 0x80, 0xe2, 0x6d, 0xd3, 0x01, 0x6a, 0x21, 0x17,
	0x80, 0x73, 0x36, 0x66, 0x82, 0xe9, 0x80, 0x62, 0xd5, 0xea, 0x00, 0xb5, 0x5c, 0x69, 0x83, 0x74,
	0xc1, 0xba, 0x9a, 0xb1, 0x6c, 0xa1, 0x40, 0xb1, 0x35, 0xf5, 0x7c, 0xb5, 0x26, 0x69, 0x43, 0x9e,
	0xa1, 0x1c, 0x0b, 0x0d, 0x51, 0x0c, 0xbd, 0x8e, 0x50, 0x03, 0x58, 0x20, 0x3e, 0xb0, 0x44, 0xd2,
	0xa4, 0x23, 0x0a, 0xa9, 0x75, 0x84, 0x92, 0x8e, 0x36, 0xc8, 0x29, 0x38, 0x8a, 0x58, 0xb2, 0x5b,
	0xc7, 0x6b, 0x95, 0xf6, 0xf7, 0xee, 0xf1, 0x4a, 0xe4, 0xb5, 0x8d, 0xff, 0x13, 0x4f, 0xfe, 0x05,
	0x00, 0x00, 0xff, 0xff, 0x4d, 0x57, 0x73, 0x7c, 0x39, 0x0a, 0x00, 0x00,
}
