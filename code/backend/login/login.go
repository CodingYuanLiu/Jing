package main

import (
	"log"
	"time"

	"github.com/micro/go-micro"
	"jing/app/login/handler"
	login "jing/app/login/proto/login"
)

type Say struct{}

func main() {
	service := micro.NewService(
		micro.Name("go.micro.handler.auth-service"),
		micro.Address("127.0.0.1:30661"),
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