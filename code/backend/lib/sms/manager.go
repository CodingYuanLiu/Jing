package sms

import (
	"net/http"

	"jing/app/lib/auth"
	"jing/app/lib/sms/client"
	"jing/app/lib/sms/rpc"
)

var (
	// Host 为 Qiniu SMS Server API 服务域名
	Host = "https://sms.qiniuapi.com"
)

// Manager 提供了 Qiniu SMS Server API 相关功能
type Manager struct {
	mac    *auth.Credentials
	client rpc.Client
}

// NewManager 用来构建一个新的 Manager
func NewManager(mac *auth.Credentials) (manager *Manager) {

	manager = &Manager{}

	mac1 := &client.Mac{
		AccessKey: mac.AccessKey,
		SecretKey: []byte(mac.SecretKey),
	}

	transport := client.NewTransport(mac1, nil)
	manager.client = rpc.Client{Client: &http.Client{Transport: transport}}

	return
}
