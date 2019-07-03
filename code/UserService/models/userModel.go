package models

import "fmt"
import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "github.com/kataras/iris"

var db *sql.DB

func QueryUser(id int) iris.Map {
	var username, password, nickname, phone string
	err := db.QueryRow(fmt.Sprintf("select * from user where id = %d", id)).Scan(&id, &username, &password, &nickname, &phone)
	if err != nil {
		fmt.Println(err)
		return iris.Map{
			"msg": fmt.Sprintf("User #%d not exists", id),
		}
	}
	return iris.Map{
		"status": 200,
		"data": iris.Map{
			"id": id,
			"username": username,
			"password": password,
			"nickname": nickname,
			"phone": phone,
		},
	}
}

func UpdateUser(form iris.Map) iris.Map {
	id := form["id"]
	nickname := form["nickname"]
	phone := form["phone"]
	_, err := db.Exec(fmt.Sprintf("update user set nickname=\"%s\", phone=\"%s\" where id = %d", nickname, phone, id))
	if err != nil {
		fmt.Println(err)
		return iris.Map{
			"status": "error",
		}
	}
	return iris.Map{
		"status": 200,
	}
}

func InsertUser(form iris.Map) iris.Map {
	username := form["username"]
	password := form["password"]
	nickname := form["nickname"]
	phone := form["phone"]
	_, err := db.Exec(fmt.Sprintf("insert into user (username, `password`, nickname, phone) values ('%s', '%s', '%s', '%s')", username, password, nickname, phone))
	if err != nil {
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