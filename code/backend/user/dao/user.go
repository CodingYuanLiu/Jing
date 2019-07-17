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
	IsAdmin int
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
	db.Where("user_id = ? and is_admin = ?", userId, 0).Find(&joins)
	for _, v := range joins {
		acts = append(acts, v.ActID)
	}
	return
}

func GetActivityAdmin(actId int) int {
	join := Join{}
	db.Where("act_id = ? and is_admin = ?", actId, 1).First(&join)
	return join.UserID
}

func CheckStatus(userId int, actId int) int {
	join := Join{}
	db.Where("act_id = ? and user_id = ?", actId, userId).First(&join)
	if join.ID == 0 {
		return -2
	} else {
		return join.IsAdmin
	}
}

func PublishActivity(userId int, actId int) error {
	join := Join{}
	join.UserID = userId
	join.ActID = actId
	join.IsAdmin = 1
	db.Create(&join)
	return nil
}


func JoinActivity(userId int, actId int) error {
	join := Join{}
	join.UserID = userId
	join.ActID = actId
	join.IsAdmin = -1
	db.Create(&join)
	return nil
}

func AcceptJoinActivity(userId int, actId int) error{
	join := Join{}
	db.Where("user_id = ? and act_id=?",userId,actId).First(&join)
	if join.ID == 0{
		err := errors.New("application not found")
		return err
	}
	if join.IsAdmin != -1{
		err := errors.New("application status error: not unaccepted")
		return err
	}
	db.Model(&join).Update("is_admin",0)
	return nil
}

func GetJoinApplication(userId int) []map[string]int{
	myActs := GetManagingActivity(userId)
	var applications []map[string] int
	var joins []Join
	for _,act := range myActs{
		db.Where("act_id=? and is_admin=?",act,-1).Find(&joins)
		for _,join := range joins{
			var application map[string] int
			application = make(map[string]int)
			application["user_id"] = join.UserID
			application["act_id"] = join.ActID
			applications = append(applications,application)
		}
	}
	return applications
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

func CreateUser(json json.JSON, id int) error {
	user, _ := FindUserById(id)
	user.Username = json["username"].(string)
	_, err := FindUserByUsername(user.Username)
	if err == nil {
		return errors.New("username already exists")
	}
	user.Password = json["password"].(string)
	user.Phone = json["phone"].(string)
	user.Nickname = json["nickname"].(string)
	db.Save(&user)
	return nil
}

func CreateUserByJaccount(jaccount string) error {
	user := User{}
	_, err := FindUserByJaccount(jaccount)
	if err == nil {
		return errors.New("jaccount has been already bound")
	}
	user.Jaccount = jaccount
	db.Create(&user)
	return nil
}

func FindUserByJaccount(jaccount string) (User, error) {
	user := User{}
	db.Where("jaccount = ?", jaccount).First(&user)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func FindUserByOpenId(openId string) (User, error) {
	user := User{}
	db.Where("open_id = ?", openId).First(&user)
	if user.ID == 0 {
		return user, errors.New("user not found")
	}
	return user, nil
}

func CreateUserByOpenId(openId string) error {
	user := User{}
	user.OpenId = openId
	db.Create(&user)
	return nil
}

func BindJaccountById(id int, jaccount string) error {
	user := User{}
	db.First(&user, id)
	if user.Jaccount != "" {
		return errors.New("jaccount has been bound")
	} else {
		user.Jaccount = jaccount
		db.Save(&user)
	}
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