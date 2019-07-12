module jing/app

go 1.12

replace github.com/ugorji/go => github.com/ugorji/go/codec v0.0.0-20190204201341-e444a5086c43

replace github.com/hashicorp/consul => github.com/hashicorp/consul v1.5.1

replace github.com/testcontainers/testcontainer-go => github.com/testcontainers/testcontainers-go v0.0.0-20181115231424-8e868ca12c0f

replace github.com/golang/lint => github.com/golang/lint v0.0.0-20190227174305-8f45f776aaf1

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gin-gonic/gin v1.4.0
	github.com/golang/protobuf v1.3.1
	github.com/jameskeane/bcrypt v0.0.0-20120420032655-c3cd44c1e20f
	github.com/jinzhu/gorm v1.9.8
	github.com/micro/go-micro v1.7.0
	github.com/micro/go-plugins v0.24.1
	github.com/micro/go-web v0.6.0
	github.com/micro/kubernetes v0.7.0
	github.com/nats-io/nats-server/v2 v2.0.0 // indirect
	github.com/skip2/go-qrcode v0.0.0-20190110000554-dc11ecdae0a9
	github.com/stretchr/testify v1.3.0
	github.com/ugorji/go/codec v1.1.7 // indirect
	golang.org/x/net v0.0.0-20190628185345-da137c7871d7 // indirect
	google.golang.org/grpc v1.22.0 // indirect
	gopkg.in/mgo.v2 v2.0.0-20160818020120-3f83fa500528
)
