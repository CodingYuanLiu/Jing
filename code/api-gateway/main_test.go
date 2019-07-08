package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/stretchr/testify/assert"
)


func TestUserStatusRoute (t *testing.T) {
	router := setupRouter()
	router.Run(":9000")
	http.NewRequest()

}