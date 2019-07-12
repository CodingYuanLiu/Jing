package dao

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"jing/app/json"
)

var db *gorm.DB

type User struct {
	ID int 				`gorm:"primary_key;auto_increment"`
	Username string
	Password string
	Nickname string
	Phone string
	Signature string
	OpenId string
	Jaccount string
}

type Join struct {
	ID 		int 		`gorm:"primary_key;auto_increment"`
	UserID	int
	ActID	int
	IsAdmin bool
}

func PublishActivity(userId int, actId int) error {
	join := Join{}
	join.UserID = userId
	join.ActID = actId
	join.IsAdmin = true
	db.Create(&join)
	return nil
}

func JoinActivity(userId int, actId int) error {
	join := Join{}
	join.UserID = userId
	join.ActID = actId
	join.IsAdmin = false
	db.Create(&join)
	return nil
}

func FindUserById(id int) (User, error) {
	user := User{}
	db.First(&user, id)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func FindUserByUsername(username string) (User, error) {
	user := User{}
	db.Where("username = ?", username).First(&user)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func UpdateUserById(id int, column string, value interface{}) error {
	user := User{}
	db.First(&user, id)
	if user.ID == 0 {
		return errors.New("user not found")
	}
	db.Model(&user).Update(column, value)
	return nil
}

func CreateUser(json json.JSON) error {
	user := User{}
	user.Username = json["username"].(string)
	_, err := FindUserByUsername(user.Username)
	if err == nil {
		return errors.New("user already exists")
	}
	user.Password = json["password"].(string)
	user.Phone = json["phone"].(string)
	user.Nickname = json["nickname"].(string)
	user.Jaccount = json["jaccount"].(string)
	db.Create(&user)
	return nil
}

func init()  {
	var err error
	//db, err = gorm.Open("mysql", "dfy:woshisb@tcp(localhost:3306)/jing")
	//db, err = gorm.Open("mysql", "dragon:HXC19970129@tcp(localhost:3306)/jing")
	db, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")
	if err != nil {
		fmt.Println(err)
	}
	if !db.HasTable(&User{}) {
		db.CreateTable(&User{})
	}
	if !db.HasTable(&Join{}) {
		db.CreateTable(&Join{})
	}
	return
}