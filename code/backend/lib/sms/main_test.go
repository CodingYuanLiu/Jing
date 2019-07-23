package sms_test

import (
	"os"

	"jing/app/lib/auth"

	"jing/app/lib/sms"
)

var manager *sms.Manager

func init() {
	accessKey := os.Getenv("accessKey")
	secretKey := os.Getenv("secretKey")

	mac := auth.New(accessKey, secretKey)
	manager = sms.NewManager(mac)
}
