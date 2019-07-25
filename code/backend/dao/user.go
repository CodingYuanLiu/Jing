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
	ID 			int 				`gorm:"primary_key;auto_increment"`
	Gender 		int
	Birthday 	string
	Major	 	string
	Dormitory 	string
	Username 	string
	Password 	string
	Nickname 	string
	Phone 		string
	Signature 	string
	OpenId 		string
	Jaccount 	string
	AvatarKey 	string
	PrivacyLevel int // 0: everybody 1: only friend (inter-follow) -1: hidden
}

type Join struct {
	ID 		int 		`gorm:"primary_key;auto_increment"`
	UserID	int
	ActID	int
	IsAdmin int
}

type TagDict struct{
	Tag string	`gorm:"unique"`
}

type CandidateTags struct {
	Tag string 	`gorm:"unique"`
	UserID int
}

type Follow struct {
	ID		int			`gorm:"primary_key;auto_increment"`
	From 	int
	To 		int
}

func SetAvatarKey(Id int, key string) {
	user := User{}
	db.Where("id = ?", Id).First(&user)
	user.AvatarKey = key
	db.Save(&user)
}

func GetAvatarKey(Id int) string {
	user := User{}
	db.Where("id = ?", Id).First(&user)
	return user.AvatarKey
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

func GetAllUserId() []int {
	var ids []int
	var users []User
	db.Find(&users)
	for _, user := range users{
		ids	= append(ids, user.ID)
	}
	return ids
}

func GetManagingActivity(userId int) (acts []int) {
	var joins []Join
	db.Where("user_id = ? and is_admin = ?", userId, true).Find(&joins)
	for _, v := range joins {
		acts = append(acts, v.ActID)
	}
	return
}

func GetAllUserActivity(userId int) (acts []int) {
	var joins []Join
	db.Where("user_id = ?", userId).Find(&joins)
	for _, v := range joins {
		acts = append(acts, v.ActID)
	}
	return
}

func GetAllUserActivityInt32(userId int) (acts []int32) {
	var joins []Join
	db.Where("user_id = ?", userId).Find(&joins)
	for _, v := range joins {
		acts = append(acts, int32(v.ActID))
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
	db.Where("user_id = ? and act_id = ?",userId,actId).First(&join)
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

func CopyUser(src User, dest User) {
	dest.OpenId = src.OpenId
	db.Delete(&src)
	db.Save(&dest)
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

func InsertNewTag(tag string){
	var newTag TagDict
	db.Find(&newTag,"tag=?",tag)
	if newTag.Tag == ""{
		newTag.Tag=tag
		db.NewRecord(newTag)
		db.Create(&newTag)
	}else{
		fmt.Printf("Existed tag %s\n",tag)
	}
}

func GetAllTags() ([]string,error){
	var tagFromDB []TagDict
	db.Find(&tagFromDB)
	var tags []string
	for _,param := range tagFromDB{
		tags = append(tags,param.Tag)
	}
	if len(tags) == 0{
		err := errors.New("fetch tags error")
		return tags,err
	}
	return tags,nil
}

func IsInTagDict(tag string) bool{
	var tagFromDB []TagDict
	db.Where("tag = ?",tag).Find(&tagFromDB)
	if len(tagFromDB) == 0 {
		return false
	}else{
		return true
	}
}

func InsertCandidateTag(tag string,userId int) int32{
	//return 1 for success, 0 for needlessness
	var candidateTag CandidateTags
	db.Find(&candidateTag,"tag=?",tag)
	if candidateTag.Tag == "" {
		candidateTag.Tag = tag
		candidateTag.UserID = userId
		db.NewRecord(candidateTag)
		db.Create(&candidateTag)
		return 1
	}else{
		if candidateTag.UserID == userId{
			return 0
		}else{
			InsertNewTag(tag)
			db.Where("tag=?",candidateTag.Tag).Delete(CandidateTags{})
			return 1
		}
	}
}

func QueryFollow(From int, To int) bool {
	follow := Follow{}
	db.Where("`from` = ? and `to` = ?", From, To).First(&follow)
	return follow.ID != 0
}

func ChangePrivacyLevel(userId int, level int) error {
	user := User{}
	db.Where("id = ?", userId).First(&user)
	user.PrivacyLevel = level
	db.Save(&user)
	return nil
}

func CreateFollow(From int, To int) {
	follow := Follow{
		From: From,
		To: To,
	}
	db.Create(&follow)
}

func GetFollowing(userId int) (ret []int) {
	var arr []Follow
	db.Where("`from` = ?", userId).Find(&arr)
	for _, v := range arr {
		ret = append(ret, v.To)
	}
	return
}

func GetFollower(userId int) (ret []int) {
	var arr []Follow
	db.Where("`to` = ?", userId).Find(&arr)
	for _, v := range arr {
		ret = append(ret, v.From)
	}
	return
}

func GetFriends(userId int) (ret []int) {
	followings := GetFollowing(userId)
	followers := GetFollower(userId)
	for _, a := range followings {
		for _, b := range followers {
			if a == b {
				ret = append(ret, a)
			}
		}
	}
	return
}

func init()  {
	var err error
	//db, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")
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
	if !db.HasTable(&TagDict{}){
		db.CreateTable(&TagDict{})
		tags := []string{"汉堡","机场","火车站","电影","会员","拼单",
			"海淘","化妆品","鞋","潮流","冷吃肉","川菜","游戏", "篮球", "足球",
			"羽毛球","乒乓球", "游泳", "跑步", "电竞", "图书馆", "约饭","旅游",
			"拼多多", "拼车", "外卖","门票", "读书会", "线下", "课程","出租车","滴滴",
			"图书", "家教",	"虹桥机场","虹桥火车站","闵行校区","徐汇校区","YSL",
			"闵行","莘庄","黄埔","徐汇","徐家汇","美罗城","大悦城","浦东机场",
			"动物园","水族馆","肯德基","麦当劳","汉堡王","饿了么","屈臣氏","口红",
			"卸妆水","迪奥","面膜","眉笔","英雄联盟","五黑","三黑","四黑","打车",
			"上分","王者荣耀","守望先锋","时代影城","欧尚","开黑","CSGO","DOTA",
			"杨浦","苏州","静安","松江","宝山","嘉定","浦东","长宁","普陀","东川路",
			"青浦","金山","奉贤","崇明","剑川路","IMAX","思源门","菁菁堂",}
		for _,tag := range tags{
			InsertNewTag(tag)
		}
	}
	if !db.HasTable(&CandidateTags{}){
		db.CreateTable(&CandidateTags{})
	}
	if !db.HasTable(&Follow{}){
		db.CreateTable(&Follow{})
	}
	if !db.HasTable(&Takeoutshop{}) {
		db.CreateTable(&Takeoutshop{})
	}
	return
}