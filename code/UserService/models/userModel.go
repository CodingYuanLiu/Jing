package models

import (
	"fmt"
	"github.com/jameskeane/bcrypt"
)
import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "github.com/kataras/iris"

var db *sql.DB

// To do: forbid SQL injection attack

func QueryIdAndPassword(username string) (id int, password string) {
	query := fmt.Sprintf("select id, password from user where username = '%s'", username)
	err := db.QueryRow(query).Scan(&id, &password)
	if err != nil {
		id = -1
		password = ""
	}
	return
}

func QueryId(j string) (id int) {
	query := fmt.Sprintf("select id from user where jaccount = '%s'", j)
	err := db.QueryRow(query).Scan(&id)
	if err != nil {
		id = -1
	}
	return
}

func QueryUser(id int) iris.Map {
	var username, nickname, phone string
	query := fmt.Sprintf("select id, username, nickname, phone from user where id = %d", id)
	err := db.QueryRow(query).Scan(&id, &username, &nickname, &phone)
	if err != nil {
		fmt.Println(query)
		fmt.Println(err)
		return iris.Map{
			"status": "error",
			"msg": fmt.Sprintf("User #%d not exists", id),
		}
	}
	return iris.Map{
		"id": id,
		"username": username,
		"nickname": nickname,
		"phone": phone,
	}
}

func UpdateUser(form iris.Map, id int) iris.Map {
	nickname := form["nickname"]
	phone := form["phone"]
	query := fmt.Sprintf("update user set nickname='%s', phone='%s' where id = %d", nickname, phone, id)
	_, err := db.Exec(query)
	if err != nil {
		fmt.Println(err)
		fmt.Println(query)
		return iris.Map{
			"status": "error",
		}
	}
	return iris.Map{
		"status": 200,
	}
}

func Login(form iris.Map) iris.Map {
	username := form["username"]
	password := form["password"]
	var id int
	query := fmt.Sprintf("select id from user where username='%s' and `password`='%s'", username, password)
	err := db.QueryRow(query).Scan(&id)
	if err != nil {
		fmt.Println(query)
		fmt.Println(err)
		return iris.Map{
			"status": "error",
			"msg": "Bad credentials",
		}
	} else {
		return QueryUser(id)
	}
}

func InsertUser(form iris.Map) iris.Map {
	username := form["username"]
	password := form["password"]
	salt, _ := bcrypt.Salt(10)
	hash, _ := bcrypt.Hash(password.(string), salt)
	nickname := form["nickname"]
	phone := form["phone"]
	jaccount := form["jaccount"]
	query := fmt.Sprintf("insert into user (username, `password`, nickname, phone, jaccount) values ('%s', '%s', '%s', '%s', '%s')", username, string(hash), nickname, phone, jaccount)
	_, err := db.Exec(query)
	if err != nil {
		fmt.Println(query)
		fmt.Println(err)
		return iris.Map{
			"status": "error",
		}
	}
	return iris.Map{
		"status": 200,
	}
}

func init() {
	var err error
	db, err = sql.Open("mysql", "dfy:woshisb@tcp(localhost:3306)/jing")
	if err != nil {
		fmt.Println(err)
	}
}
