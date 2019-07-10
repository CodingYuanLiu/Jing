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
	Actid int32
	BasicInfo BasicInfo
	TaxiInfo TaxiInfo
}

type TakeoutInfo struct{
	Store string
	OrderTime string
}
type TakeoutAct struct{
	Actid int32
	TakeoutInfo TakeoutInfo
	BasicInfo BasicInfo
}