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

## Run Beego with docker
Firstly, pull mysql image and run it:
``` bash
docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=yyyuan8868218 -d mysql:5.6
```
-e parameter is required to be the root password.
Secondly, create a QuickStart database in mysql container
``` bash
docker exec -it mysql-test bash
```
In the container:
``` bash
mysql -u root -p
```
```sql
create database QuickStart;
```
To see the ip of the container,use:
``` bash
root@2619804835c4:/# cat /etc/hosts
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.2      2619804835c4
```
So in my go `model.go` file, change the address of mysql to:
```go
    orm.RegisterDataBase("default", "mysql", "root:yyyuan8868218@tcp(172.17.0.2:3306)/QuickStart?charset=utf8", 30)
```

Then create beego container. Firstly add a dockerfile:
```dockerfile
FROM golang:1.10.7
EXPOSE 8080
CMD ["/bin/bash"]
```
build and run the image
```bash
docker build -t go_dbtest .
docker run -dit --name go_test1 -v C:\Users\Liu\go\src\:/go/src -p 8088:8080 go_dbtest:latest
```
C:\Users\Liu\go\src is the `GOPATH` of my win10, so that GOPATH\quickstart is my recent workdir.
Entry the go container and get beego:
```bash
docker exec -it go_test1 bash
```
In the container:
``` bash
go get github.com/astaxie/beego 
go get github.com/beego/bee 
go get github.com/go-sql-driver/mysql
go get github.com/astaxie/beego/orm
```
Now,run beego in the container manually
```bash
bee run
```
Now we can access the service on 8088.