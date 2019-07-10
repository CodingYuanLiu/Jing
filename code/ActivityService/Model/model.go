package Model

type BasicAct struct{
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
	BasicInfo BasicAct
	TaxiInfo TaxiInfo
}