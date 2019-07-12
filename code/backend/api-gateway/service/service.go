package service

import (
	"strings"
)

func VerifyAuthorization(auth string) (bool, string) {
	if !strings.Contains(auth,"Bearer "){
		return false, ""
	} else {
		jwt := strings.TrimPrefix(auth[7:], " ")
		return true, jwt
	}

}


func VerifyUP(username string, password string) bool {
	if username == "" || password == "" {
		return false
	} else {
		return true
	}
}



