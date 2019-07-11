package main

import (
	"log"
	"time"

	"github.com/micro/go-micro"
	"jing/app/user/handler"
	user "jing/app/user/proto/user"
	k8s "github.com/micro/kubernetes/go/micro"
)

func main() {
	service := k8s.NewService(
		micro.Name("go.micro.srv.user"),
		micro.Address(":9090"),
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