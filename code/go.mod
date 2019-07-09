module jing/app

go 1.12

replace github.com/hashicorp/consul => github.com/hashicorp/consul v1.5.1

replace github.com/testcontainers/testcontainer-go => github.com/testcontainers/testcontainers-go v0.0.0-20181115231424-8e868ca12c0f

replace github.com/golang/lint => github.com/golang/lint v0.0.0-20190227174305-8f45f776aaf1

require (
	github.com/astaxie/beego v1.12.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/dustin/go-humanize v1.0.0 // indirect
	github.com/gin-gonic/gin v1.4.0
	github.com/go-sql-driver/mysql v1.4.1
	github.com/golang/protobuf v1.3.1
	github.com/google/go-querystring v1.0.0 // indirect
	github.com/jameskeane/bcrypt v0.0.0-20120420032655-c3cd44c1e20f
	github.com/jinzhu/gorm v1.9.8
	github.com/micro/examples v0.1.0
	github.com/micro/go-micro v1.7.0
	github.com/nats-io/nats-server/v2 v2.0.0 // indirect
	github.com/shiena/ansicolor v0.0.0-20151119151921-a422bbe96644 // indirect
	github.com/smartystreets/goconvey v0.0.0-20190330032615-68dc04aab96a
	github.com/stretchr/testify v1.3.0
	golang.org/x/net v0.0.0-20190628185345-da137c7871d7
	google.golang.org/grpc v1.22.0
)
