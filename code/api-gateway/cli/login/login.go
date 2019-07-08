package cli_login

import (
	proto_login "../../proto/login"
	//"github.com/micro/go-micro/client"
)


var (
	LoginClient proto_login.LoginService
	)


func init() {
	//LoginClient := proto_login.NewLoginService("go.micro.srv.login", client.DefaultClient)
}

