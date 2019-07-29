package jing

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
	"strings"
)

type Error struct {
	errCode int
	respStatus int
	message string
}

func Format(err error) error {
	var j map[string]interface{}
	_ = json.Unmarshal([]byte(err.Error()), &j)
	errStr := j["detail"].(string)
	// errStr := err.Error()
	arr := strings.Split(errStr, "\t")
	fmt.Println(arr)
	errCode, _ := strconv.Atoi(arr[1])
	respStatus, _ := strconv.Atoi(arr[2])
	return &Error{
		errCode: errCode,
		respStatus: respStatus,
		message: arr[0],
	}
}

func SendError(c *gin.Context, err error) {
	e := Format(err).(*Error)
	c.JSON(e.respStatus, e.JSON())
	c.Abort()
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s\t%d\t%d", e.message, e.errCode, e.respStatus)
}

func (e *Error) JSON() map[string]interface{} {
	return map[string]interface{} {
		"errcode": e.errCode,
		"status": e.respStatus,
		"message": e.message,
	}
}

func NewError(errCode int, respStatus int, message string) error {
	return &Error{
		errCode: errCode,
		respStatus: respStatus,
		message: message,
	}
}