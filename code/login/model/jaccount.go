package model

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

func GetRawLoginUrl(clientId string, scope string, redirectUri string) string {
	return fmt.Sprintf("https://jaccount.sjtu.edu.cn/oauth2/authorize?response_type=code&client_id=%s&scope=%s"+
		"&redirect_uri=%s", clientId, scope, redirectUri)
}

func GetAccessToken(code string, clientId string, clientSecret string, redirectUri string) string {
	resp, _ := http.PostForm("https://jaccount.sjtu.edu.cn/oauth2/token", url.Values{
		"grant_type": {"authorization_code"},
		"code": {code},
		"redirect_uri": {redirectUri},
		"client_id": {clientId},
		"client_secret": {clientSecret},
	})
	respJson, _ := ioutil.ReadAll(resp.Body)
	j := JSON{}
	_ = json.Unmarshal(respJson, &j)
	fmt.Println(j)
	return j["access_token"].(string)
}

func GetProfile(accessToken string) JSON {
	req, _ := http.NewRequest("GET", "https://api.sjtu.edu.cn/v1/me/profile", nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	client := &http.Client{}
	resp, _ := client.Do(req)
	respJson, _ := ioutil.ReadAll(resp.Body)
	j := JSON{}
	_ = json.Unmarshal(respJson, &j)
	return j
}