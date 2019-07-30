package models

import (
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

type Pair struct {
    Key    string   `json:"key"  orm:"pk"`
    Value  string   `json:"value"`
}

func init() {
    // set default database
    orm.RegisterDataBase("default", "mysql", "root:yyyuan8868218@tcp(127.0.0.1:3306)/QuickStart?charset=utf8", 30)

    // register model
    orm.RegisterModel(new(Pair))

    // create table
    orm.RunSyncdb("default", false, true)
}

func Insert(key string, value string) {
	o := orm.NewOrm()
	p := Pair{Key: key, Value: value}
	o.Insert(&p)
}

func Find(key string) Pair {
	o := orm.NewOrm()
	p := Pair{Key: key}
	o.Read(&p, "Key")
	return p
}