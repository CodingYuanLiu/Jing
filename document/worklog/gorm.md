# Gorm 学习

## Feature 功能介绍

据`gorm`官方文档介绍，它几乎是一个完整的`ORM`框架，拥有`Associations`,`Loading Mechanism`, `Transactions`, `Composite promary key`等

其官方文档列觉得特性这里就不过多说明，需要的同志可以直接参阅其[Gorm 文档](https://gorm.io/docs/index.html)

### Quick start

用`gorm`写一个简单的数据库连接的小程序

```go
package main

import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/mysql"
)
// Model
type User struct {
    gorm.Model
    name        string `gorm: "Type: varchar(50); Size: 50"`
    nickname    string `gorm: "Type: varchar(50); Size: 50"`
    age         int8   `gorm: "Type: smallint"`
}

func main () {
    db, err := gorm.Open("mysql", "sample")
}
```

## Model 定义

用`gorm`定义`Model`其实就是定义一个`struct`, 所有映射的关系、字段类型、字段长度、列属性（主键/外建/唯一）都可以用`struct tag`来进行配置

这里暂时也不多介绍，也是从官方文档看来的

## Model <-> Database

`Model`到`Database`的映射可以进行配置。

我从官文上看到的有以下几点

1. 列名/属性
   - 默认是小写, 除了首字母外，大写的会换成下划线，。例如`GraduateDate` -> `graduate_date`
   - 这些其实都是`Model`定义的时候`struct tag`里的配置
2. 表名
   - 默认是`Model`的`struct`名称的负数
   - 可以自己配置表名
     - `db.SingularTable(true)`用来直接将`Ｍodel`名作为表名
     - `gorm.DefaulTableNameHandler = func (db *gorm.DB, defaultTableName string) string {}`

## Connection 数据库连接

这个没什么好说的，官网都有，我这里提供几个示例</br>
需要注意的是　需要引入数据库的`driver`

官网给了`mysql`的例子，`import _ "github.com/go-sql-driver/mysql"`

直接`main`里连接，

```go

```

`Singleton`　创建连接

```go

```
