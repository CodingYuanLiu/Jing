# Golang with MongoDB
## Reference
> https://www.jianshu.com/p/b63e5cfa4ce5
> https://www.jianshu.com/p/81cdb0d58b62
## Dependencies
目前网上driver里面使用最多的是这个库:
``` go
import (
    "fmt"
    "gopkg.in/mgo.v2" 
    "gopkg.in/mgo.v2/bson" // 主要用于查询。
)
```
此外，很多教程里面使用了这样的库：
``` go
/*
 * 个人不推荐使用这个库。理由如下：
 * 1. 测试时使用go module直接引入依赖。但是在我的电脑上这个库go module似乎找不到对应的package
 * 2. 有教程提到这个库的功能不完全。
*/
import (
    "fmt"
    "labix.org/v2/mgo"
    "labix.org/v2/mgo/bson"
)

```
利用go module 可以直接下载好这两个依赖，不需要其他的额外下载。
## Usage
### Connect to database
``` go
session, err := mgo.Dial("127.0.0.1:27017")
/*
    With username and password:
    mgo_url := "mongodb://t1:t1@localhost:27017/test?authMechanism=SCRAM-SHA-1"
    session, err := mgo.Dial(mgo_url)
*/
if err != nil {
    panic(err)
}

session.SetMode(mgo.Monotonic, true) //不知道这句的用途,删掉也能运行

defer session.Close()
```
Open the collection of a database:
``` go
db := session.DB("Bookcomment")
collection := db.C("Bookcomment")
/* Or: 
   collection :=session.DB("Bookcomment").C("Bookcomment")
*/
```
### Query
Find all:
``` go
var users []User
collection.Find(nil).All(&users)
```
Find by attribute
``` go
result := User{}
err = collection.Find(bson.M{"userid": 1}).One(&result)
var users []User
c.Find(bson.M{"name": "Jimmy Kuu"}).All(&users)
```
Conditional Query:
``` go
//单条件查询，以>($gt) 为例
collection.Find(bson.M{"age": bson.M{"$gt": 32}}).All(&users)
//多条件查询：以or($or)为例
c.Find(bson.M{"$or": []bson.M{bson.M{"name": "Jimmy Kuu"}, bson.M{"age": 31}}}).All(&users)
```
### Update
``` go
//$set直接修改，修改指定_id的object
c.Update(
bson.M{"_id": bson.ObjectIdHex("5204af979955496907000001")},
bson.M{"$set": bson.M{ "name": "Jimmy Gu", "age": 34, }}
)
//$inc栏位增加值
c.Update(
bson.M{"_id": bson.ObjectIdHex("5204af979955496907000001")},
bson.M{"$inc": bson.M{ "age": -1, }}
)
//$push增加一个元素
c.Update(
bson.M{"_id": bson.ObjectIdHex("5204af979955496907000001")},
bson.M{"$push": bson.M{ "interests": "Golang", }}
)
//$pull删除一个元素
c.Update(
bson.M{"_id": bson.ObjectIdHex("5204af979955496907000001")},
bson.M{"$pull": bson.M{ "interests": "Golang", }}
)
```
### Delete
delete也支持条件，类似条件查询。
```go
c.Remove(bson.M{"name": "Jimmy Kuu"})
```
### Insert
``` go
temp := bookcomment{
    Bnum:212, // Book number
    Comment: []string{ // Book comments
        "comment1",
        "comment2",
    },
}
err = collection.Insert(temp)
```
