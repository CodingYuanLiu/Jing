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
