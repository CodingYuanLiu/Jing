package dao

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	userDao "jing/app/user/dao"
)

var db *gorm.DB

func FindUserByJaccount(jaccount string) (userDao.User, error) {
	user := userDao.User{}
	db.Where("jaccount = ?", jaccount).First(&user)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func FindUserByUsername(username string) (userDao.User, error) {
	user := userDao.User{}
	db.Where("username = ?", username).First(&user)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func init()  {
	var err error
	db, err = gorm.Open("mysql", "dfy:woshisb@tcp(localhost:3306)/jing")
	if err != nil {
		fmt.Println(err)
	}
	if !db.HasTable(&userDao.User{}) {
		db.CreateTable(&userDao.User{})
	}
	return
}