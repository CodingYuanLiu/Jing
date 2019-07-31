# Go module
Go module 是Go的用于依赖管理的工具。比起原先的GOPATH存储库的方式，Go module 可以很好的解决不同版本依赖的问题。
## Activate Module
通过设置环境变量`GO111MODULE`来激活modules。调整`GO111MODULE=on`。Linux和Windows的调整方式不一样。
## 初始化Module
首先因为下载的包里面许多需要翻墙，因此需要设置代理：
* GOPROXY=https://goproxy.io

创建一个简单的项目。使用一个库rsc.io/quote
``` go
package testgomod

import "rsc.io/quote"

func Hello() string {
    return quote.Hello()
}
```
进入项目目录，使用：
```bash
go mod init 
# Or go mod init <name>
```
Then a go.mod file will be generated automatically:
``` mod
module testgomod
go 1.12
```
## 使用Module
因为我们没有go get过这个库，因此若是不使用go mod，没有经过`go mod init`直接`go run main.go`，会报找不到库的错。但是此时，我们`go run main.go`，会从命令行看到它开始寻找各种库。
``` bash
$ go run main.go
go: finding rsc.io/quote v1.5.2
go: finding rsc.io/sampler v1.3.0
go: finding golang.org/x/text v0.0.0-20170915032832-14c0d48ead0c
go: downloading rsc.io/quote v1.5.2
go: extracting rsc.io/quote v1.5.2
go: downloading rsc.io/sampler v1.3.0
go: extracting rsc.io/sampler v1.3.0
go: downloading golang.org/x/text v0.0.0-20170915032832-14c0d48ead0c
go: extracting golang.org/x/text v0.0.0-20170915032832-14c0d48ead0c
Hello, world.
```
此时再看go.mod文件，会发现go.mod文件变成了：
```mod
module testgomod

go 1.12

require rsc.io/quote v1.5.2
```
此时还多了一个go.sum文件。

再一次使用`go run main.go`,则不需要再次安装这些包就能直接运行了。