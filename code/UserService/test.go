package main

import (
	"./jaccount"
	"fmt"
)

func main() {
	accessToken := jaccount.GetAccessToken("666f34058605488b9be1ff930114fec0", "KIr40g1K90EObtNARwda",
		"16BA4A646213794CD6C72F32F219D37A4AE51345897AC889", "https://sebastianj1wzyd.xyz/print")
	fmt.Printf(jaccount.GetProfile(accessToken)["account"].(string))
}
