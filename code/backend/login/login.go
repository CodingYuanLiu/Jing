package main

import (
	"log"
	"time"

	"jing/app/login/handler"
	login "jing/app/login/proto/login"

	"github.com/micro/go-micro"
	k8s "github.com/micro/kubernetes/go/micro"
)

func main() {
	service := k8s.NewService(
		micro.Name("auth-service"),
		micro.Address(":8080"),
		micro.RegisterTTL(time.Second*30),
		micro.RegisterInterval(time.Second*10),
	)

	// optionally setup command line usage
	service.Init()

	// Register Handlers
	login.RegisterLoginHandler(service.Server(), new(handler.LoginService))

	// Run server
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}
