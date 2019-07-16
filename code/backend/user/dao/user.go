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

// TODO: let lqy implement these more functionally
func GetAllActId() []int {
	var joins []Join
	db.Find(&joins)
	actIds := map[int]int{}
	for _, v := range joins {
		actIds[v.ActID] = 1
	}
	var acts []int
	for k := range actIds {
		acts = append(acts, k)
	}
	return acts
}

func GetManagingActivity(userId int) (acts []int) {
	var joins []Join
	db.Where("user_id = ? and is_admin = ?", userId, true).Find(&joins)
	for _, v := range joins {
		acts = append(acts, v.ActID)
	}
	return
}

func DeleteActivity(actId int) error {
	db.Where("act_id = ?", actId).Delete(Join{})
	return nil
}

func GetJoinedActivity(userId int) (acts []int) {
	var joins []Join
	db.Where("user_id = ? and is_admin = ?", userId, false).Find(&joins)
	for _, v := range joins {
		acts = append(acts, v.ActID)
	}
	return
}

func GetActivityAdmin(actId int) int {
	join := Join{}
	db.Where("act_id = ? and is_admin = ?", actId, true).First(&join)
	return join.UserID
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
	db, err = gorm.Open("mysql", "jing:jing@tcp(mysql.database:3306)/jing")
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