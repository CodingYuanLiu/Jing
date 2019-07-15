package model

type BasicInfo struct{
	//ActId int32
	Type string
	CreateTime string
	EndTime string
	Title string
	Description string
	//Comments []Comment
	Tag []string
	Images []string
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
	Comments []Comment
}

type TakeoutInfo struct{
	Store string
	OrderTime string
}
type TakeoutAct struct{
	ActId int32
	TakeoutInfo TakeoutInfo
	BasicInfo BasicInfo
	Comments []Comment
}

type OrderInfo struct{
	Store string
}
type OrderAct struct{
	ActId int32
	BasicInfo BasicInfo
	OrderInfo OrderInfo
	Comments []Comment
}

type OtherInfo struct{
	ActivityTime string
}

type OtherAct struct {
	ActId int32
	BasicInfo BasicInfo
	OtherInfo OtherInfo
	Comments []Comment
}

type Comment struct {
	ReceiverId int32
	UserId int32
	Content string
	Time string
}