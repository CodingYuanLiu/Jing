# Go & Beego

## Environment Variables

```sh
export GOROOT="/usr/lib/go"
export GOBIN=$GOROOT/bin
export GOPATH="/home/dfy/gopath" 
export PATH=$PATH:$GOPATH/bin 
export PATH=$PATH:$GOBIN
```
`GOROOT` indicates Go compiler's path, `GOPATH` indicates **workspace**. Generally, Go applications are in `GOPATH`, and packages/libs downloaded will be stored to `GOPATH` too.

## Install Beego

```go
go get github.com/beego/bee
go get github.com/astaxie/beego
```

Then, use `bee new quickstart` will start a new project in `GOPATH`.

## Project Struct

```go
.
├── conf
│   └── app.conf           // Config
├── controllers
│   └── controller.go      // Controller
├── main.go                // Entry
├── models
│   └── model.go           // Model
├── routers
│   └── router.go          // Router
└── tests
    └── default_test.go    // Test
```

## Main

`main.go`
```go
package main

import (
	_ "quickstart/routers"
	"github.com/astaxie/beego"
)

func main() {
    beego.Run()
}
```

`main.go` is the entry of beego project. After importing two packages, it will run `beego.Run()` to start the http server at port 8080.

- `import` will package's execute `init()` method and import functions & struct of the package, but underlined import just execute `init()` of one package
- By configuring `conf/app.conf`, we can config the server properties, like port

## Router

`router.go`
```go
package routers

import (
	"quickstart/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/insert", &controllers.InsertController{})
	beego.Router("/find", &controllers.FindController{})
}
```

After init of `router.go` (caused by `import _ "quickstart/routers"`), the router will map url `/insert` to `InsertController` and `/find` to `FindController`.

## Controller

`controller.go`
```go
package controllers

import (
    "quickstart/models"
	"github.com/astaxie/beego"
)

type InsertController struct {
    beego.Controller
}

type FindController struct {
    beego.Controller
}

func (this *FindController) Get() {
    key := this.GetString("key")
    if key == "" {
        this.Ctx.WriteString("empty")
    } else {
        this.Data["json"] = models.Find(key)
        this.ServeJSON()
    }
}

func (this *InsertController) Post() {
    key := this.GetString("key")
    value := this.GetString("value")
    if key == "" || value == "" {
        this.Ctx.WriteString("empty")
    } else {
        models.Insert(key, value)
        this.Ctx.WriteString("success")
    }
}
```

In two type declaration, we declares two controller, `InsertController` and `FindController`, both of them are children of `beego.Controller`.

In `FindController`, we implements `Get` method. When url accessed, it get params `key`, then send it to `models.Find()` (or occur error by empty `key`). `InsertController` is the same.

## Models

`model.go`
```go
package models

import (
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

type Pair struct {
    /* 
    when output as json, the struct will be
    {
        "key": "xxx",
        "value": "xxx"
    }
    */
    Key    string   `json:"key"  orm:"pk"` // primary key
    Value  string   `json:"value"`
}

func init() {
    // set default database
    orm.RegisterDataBase("default", "mysql", "username:password@tcp(127.0.0.1:3306)/QuickStart?charset=utf8", 30)

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
```

In model, we build a connection to mysql. At first, model connect database by uri, then register model and create table. Obviously, `Insert()` inserts a key-value pair to database, and `Find()` finds a key-value pair by `key`.