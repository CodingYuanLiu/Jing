package main

import (
	"log"
	"time"

	"jing/app/user/handler"
	user "jing/app/user/proto/user"

	"github.com/micro/go-micro"
	//k8s "github.com/micro/kubernetes/go/micro"
)

func main() {
	service := micro.NewService(
		micro.Name("user"),
		micro.Address("127.0.0.1:10080"),
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
