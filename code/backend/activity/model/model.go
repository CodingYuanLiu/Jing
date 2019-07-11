package model

type BasicInfo struct{
	//Actid int32
	Type string
	CreateTime string
	EndTime string
	Title string
	Description string
	Tag []string
}

type TaxiInfo struct{
	DepartTime string
	Origin string
	Destination string
}

type TaxiAct struct{
	ActId int32
	BasicInfo BasicInfo
	TaxiInfo TaxiInfo
}

type TakeoutInfo struct{
	Store string
	OrderTime string
}
type TakeoutAct struct{
	ActId int32
	TakeoutInfo TakeoutInfo
	BasicInfo BasicInfo
}

type OrderInfo struct{
	Store string
}
type OrderAct struct{
	ActId int32
	BasicInfo BasicInfo
	OrderInfo OrderInfo
}

type OtherInfo struct{
	ActivityTime string
}
type OtherAct struct {
	ActId int32
	BasicInfo BasicInfo
	OtherInfo OtherInfo
}