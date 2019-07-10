package main

import (
	"log"
	"time"

	"github.com/micro/go-micro"
	"jing/app/user/handler"
	user "jing/app/user/proto/user"
)

func main() {
	service := micro.NewService(
		micro.Name("go.micro.srv.user"),
		micro.Address("127.0.0.1:30662"),
		micro.RegisterTTL(time.Second*30),
		micro.RegisterInterval(time.Second*10),
	)

	// optionally setup command line usage
	service.Init()

	// Register Handlers
	user.RegisterUserHandler(service.Server(), new(handler.UserService))

	// Run server
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}