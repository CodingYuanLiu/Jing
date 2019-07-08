package dao

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB

type User struct {
	ID int 				`gorm:"primary_key;auto_increment"`
	Username string		`gorm:"not null"`
	Password string		`gorm:"not null"`
	Nickname string		`gorm:"not null"`
	Phone string		`gorm:"not null"`
	Signature string
	Jaccount string		`gorm:"not null"`
}

func FindUserByJaccount(jaccount string) (User, error) {
	user := User{}
	db.Where("jaccount = ?", jaccount).First(&user)
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

func init()  {
	var err error
	//db, err = gorm.Open("mysql", "dfy:woshisb@tcp(localhost:3306)/jing")
	db, err = gorm.Open("mysql", "dragon:HXC19970129@tcp(localhost:3306)/jing")
	if err != nil {
		fmt.Println(err)
	}
	if !db.HasTable(&User{}) {
		db.CreateTable(&User{})
	}
	return
}