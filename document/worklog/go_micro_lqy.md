# Go_Micro
## Features
* Service discovery - Automatic service registration and name resolution. Service discovery is at the core of micro service development. When service A needs to speak to service B it needs the location of that service. The default discovery mechanism is multicast DNS (mdns), a zeroconf system. You can optionally set gossip using the SWIM protocol for p2p networks or consul for a resilient cloud-native setup.
* Load Balancing - Client side load balancing built on service discovery. Once we have the addresses of any number of instances of a service we now need a way to decide which node to route to. We use random hashed load balancing to provide even distribution across the services and retry a different node if there’s a problem.
* Message Encoding - Dynamic message encoding based on content-type. The client and server will use codecs along with content-type to seamlessly encode and decode Go types for you. Any variety of messages could be encoded and sent from different clients. The client and server handle this by default. This includes proto-rpc and json-rpc by default.
* Request/Response - RPC based request/response with support for bidirectional streaming. We provide an abstraction for synchronous communication. A request made to a service will be automatically resolved, load balanced, dialled and streamed. The default transport is http/1.1 or http2 when tls is enabled.
* Async Messaging - PubSub is built in as a first class citizen for asynchronous communication and event driven architectures. Event notifications are a core pattern in micro service development. The default messaging is point-to-point http/1.1 or http2 when tls is enabled.
* Pluggable Interfaces - Go Micro makes use of Go interfaces for each distributed system abstraction. Because of this these interfaces are pluggable and allows Go Micro to be runtime agnostic. You can plugin any underlying technology.

## Getting started
### Install go protobuf: for GRPC
* protoc - Download at github (https://github.com/protocolbuffers/protobuf/releases ) get `protoc-3.8.0-win64.zip
` for windows.
* protoc-gen-go - `go get github.com/micro/protobuf/{proto,protoc-gen-go}`
* protoc-gen-micro - `go get github.com/micro/protoc-gen-micro`

### Install consul
Download consul.exe directly.

Use `consul agent -dev` to activate the develop mode.

Open another terminal and use `consul members` to inspect the members of a consul cluster.

The consul page can be seen at http://localhost:8500

### A simple example
#### Create service proto
``` proto
syntax = "proto3";

service Greeter {
	rpc Hello(HelloRequest) returns (HelloResponse) {}
}

message HelloRequest {
	string name = 1;
}

message HelloResponse {
	string greeting = 2;
}
```
One of the key requirements of microservices is strongly defined interfaces. Micro uses protobuf to achieve this.

Here we define the Greeter handler with the method Hello. It takes a HelloRequest and HelloResponse both with one string arguments.
#### Write the service
Service做了如下事情：
1. 按照Greeter handler需要满足的接口实现了Handler。
2. 初始化了一个micro service
3. 注册Greeter Handler
4. 运行service
``` go
package main

import (
	"context"
	"fmt"

	micro "github.com/micro/go-micro"
	proto "github.com/micro/examples/service/proto"
)

type Greeter struct{}

func (g *Greeter) Hello(ctx context.Context, req *proto.HelloRequest, rsp *proto.HelloResponse) error {
	rsp.Greeting = "Hello " + req.Name
	return nil
}

func main() {
	// Create a new service. Optionally include some options here.
	service := micro.NewService(
		micro.Name("greeter"),
	)

	// Init will parse the command line flags.
	service.Init()

	// Register handler
	proto.RegisterGreeterHandler(service.Server(), new(Greeter))

	// Run the server
	if err := service.Run(); err != nil {
		fmt.Println(err)
	}
}
```
使用 `go run main.go --registry=consul` 来运行这个服务。输出：
``` 
2016/03/14 10:59:14 Listening on [::]:50137
2016/03/14 10:59:14 Broker Listening on [::]:50138
2016/03/14 10:59:14 Registering node: greeter-ca62b017-e9d3-11e5-9bbb-68a86d0d36b6
```
#### Define a client
Below is the client code to query the greeter service.
The generated proto includes a greeter client to reduce boilerplate code.
``` go
package main

import (
	"context"
	"fmt"

	micro "github.com/micro/go-micro"
	proto "github.com/micro/examples/service/proto"
)

func main() {
	// Create a new service. Optionally include some options here.
	service := micro.NewService(micro.Name("greeter.client"))
	service.Init()

	// Create new greeter client
	greeter := proto.NewGreeterService("greeter", service.Client())

	// Call the greeter
	rsp, err := greeter.Hello(context.TODO(), &proto.HelloRequest{Name: "John"})
	if err != nil {
		fmt.Println(err)
	}

	// Print response
	fmt.Println(rsp.Greeting)
}
```
Run the client
``` bash
go run client.go
```
Output
``` bash
Hello John
```

### Plugins
go-Micro 默认了一系列interface来实现一系列功能。但是这些功能都是可以通过插件灵活替换的。比如可以利用etcd来服务注册而不是默认的consul(新版go-micro的默认服务注册应该是mdns)。
修改服务注册为consul:

main.go: import plugins
```go
import (
	"context"
	"fmt"
	"time"

	proto "github.com/micro/examples/service/proto"
	"github.com/micro/go-micro"
	"github.com/micro/go-micro/registry"
	"github.com/micro/go-micro/registry/consul"
)
```
使用注册服务
``` go
reg := consul.NewRegistry(func(op *registry.Options) {
	op.Addrs = []string{
		"127.0.0.1:8500",
	}
})
// Create a new service. Optionally include some options here.
service := micro.NewService(
	micro.Name("greeter"),
	micro.Registry(reg),
)
```
### Wrappers
go-Micro 可以利用Decorator pattern的思想，对已有的服务进行包装加工。例如,在server端我们给handler加一个输出日志的功能：
```go
// implements the server.HandlerWrapper
func logWrapper(fn server.HandlerFunc) server.HandlerFunc {
	return func(ctx context.Context, req server.Request, rsp interface{}) error {
		fmt.Printf("[%v] server request: %s", time.Now(), req.Endpoint())
		return fn(ctx, req, rsp)
	}
}
```
然后用这个函数去Decorate我们的服务，给我们的服务加上这个功能：
``` go
service := micro.NewService(
	micro.Name("greeter"),
	// wrap the handler
	micro.WrapHandler(logWrapper),
)
```
Client同样可以用这样的方法添加功能：
``` go
type logWrapper struct {
	client.Client
}

func (l *logWrapper) Call(ctx context.Context, req client.Request, rsp interface{}, opts ...client.CallOption) error {
	fmt.Printf("[wrapper] client request to service: %s endpoint: %s\n", req.Service(), req.Endpoint())
	return l.Client.Call(ctx, req, rsp)
}

// implements client.Wrapper as logWrapper
func logWrap(c client.Client) client.Client {
	return &logWrapper{c}
}
```
```go
service := micro.NewService(
	micro.Name("greeter.client"),//这个地方的代码，官方文档上有误！
	// wrap the client
	micro.WrapClient(logWrap),
)
```

### 大坑: 选择服务注册ip
> 这是一个困扰了我数日的问题，为此我还向github官方发了个issue：https://github.com/micro/examples/issues/70

我使用的windows系统。若是不选择服务注册的ip，则系统会把服务注册到一个我用ipconfig查不到的ip上面。因此访问这个服务会报`{"id":"go.micro.client","code":408,"detail":"call timeout: context deadline exceeded","status":"Request Timeout"} `错误。</br>
因此，我需要手动选择服务注册的ip地址。
``` go
// server.go
service := micro.NewService(
		micro.Name("go.micro.srv.greeter"),
		micro.Address("127.0.0.1:54782"),//端口号随便指定一个
	)
```
之后这个服务就会被注册到127.0.0.1上面，并且可以成功访问。