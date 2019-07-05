package main

import (
	"context"
	"fmt"
	proto "github.com/micro/examples/service/proto"
	"github.com/micro/go-micro"
	"github.com/micro/go-micro/registry/consul"
	"github.com/micro/go-micro/registry"
)



func main() {
	// Create a new service. Optionally include some options here.
	reg := consul.NewRegistry(func(op *registry.Options) {
		op.Addrs = []string{
			"127.0.0.1:8500",
		}
	})
	service := micro.NewService(
		micro.Name("greeter.client"),
		micro.Registry(reg))
	service.Init()
	// Create new greeter client
	greeter := proto.NewGreeterService("greeter", service.Client())
	// Call the greeter
	rsp, err := greeter.Hello(context.TODO(), &proto.HelloRequest{Name: "John"})
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print response
	fmt.Println(rsp.Greeting)
}