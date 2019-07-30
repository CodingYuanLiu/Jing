# Go

## Definition & Declaration

```go
var a int
var b []string
var c struct{
    d int
}

// initialize
var e int = 10
// impilicit type, let compiler determine
var f = 10
// slice
g := "Hello, world!"
h := make([]int, 3)
h[0] = 1
h[1] = 2
h[2] = 3


// Address and Pointer
ptr := &v
// Print address
fmt.Printf("%d", &ptr)
var pointer *int
```

## Commandline arguments

```go
/*
 * flag package can help us simplify commandline parse
 */
package main
 import (
     "flag"
     "fmt"
 )

 var mode = flag.String("arg", "defaultValue", "help information")
 func main() {
     flag.Parse()
     fmt.Println(*mode)
 }
```

## Array

```go
var arr = [3]string{
    "summer",
    "spring",
    "fall"}
// Let compiler determine array size
arr = [...]string{
    "summer",
    "fall",
    "winter"}
// Array and slice is a type, if need to change its value without cast, we must make it another array with the same length
```

## Map

```go
// map is like array, it is a built-in type
var mm = make(map[int]string);
mm[0] = "第一个"
mm[1] = "第二个"
// Above code declare a map with int key and string value
```

## List

```go
package main
import (
    "container/list"
    "fmt"
)
func main() {
    l := list.New();
    l.PushBack("first")
    l.PushBack("second")
    l.PushFront("third")
    for k := l.Front(); k != nil; k = k.Next(){
        fmt.Println(k.Value)
    }
}
```

## for, if, switch

### if

```go
// The brace following if statement must in the same line with if statement
package main
import (
    "fmt"
)
func main() {
    var num int = 11
    if num > 10 {
        fmt.Println("Hello, world!")
    } else {
        fmt.Println("Good Bye, my world!")
    }
    if a := test(); a > 9 {
        fmt.Println("Hello, test is larger than 9")
    } else {
        fmt.Println("Hello, test is less than 9")
    }
}
// In if statement, we can also get value from function and then test it
func test() int{
    return 10
}
```

### for

```go
// structure is as follows
for initial; condition statement; iteration {
    loop;
}
// Also, the brace must in the same line with for statement
for step := 1; step < 10; step++ {
    fmt.Println(step)
}

// dead loop
for {
    // dead loop
}

// while loop
for i <= 10 {
    i++
}

//foreach
for k, v := range []int{1,2,3,4} {
    fmt.Printf("key: %d value: %d\n", k, v)
}
```

### switch

```go
// In go, switch can test for various type of value and need not break
var a = "hello"
switch a {
    case "hello" :
        fmt.Println("is hello")
    case "world" :
        fmt.Println("is world")
}
```

## function

```go
func name(args) (return arg list) {
    body
}
// In go function can return multiple values, so return value is a list in parentheses
```

```go
// anonymous function and closure
a := func(data int) {
    return data;
}(1)
fmt.Println(a);
```

## struct

```go
type name struct{
    value type
    value type
    ...
}
```

```go
package main
import (
    "fmt"
)
type Point struct {
	x int
	y int
}
func main() {
	var p Point;
	p.x = 1; p.y	= 2
	fmt.Println(p)
    // We can also use new to initialize variable. However, the value initialized is a pointer.
    pp := new(Point)
    fmt.Println(*pp)

    // Anonymous struct
    ppp := struct {
        id int
        val string
    }{
        1,
        "me",
    }
    fmt.Println(ppp)
}

```

### struct method

```go
package main
import (
    "fmt"
)
type Method struct {
	items []int
}
func (m *Method) Insert(item int) {
	m.items = append(m.items, item)
}

func main() {
	method := new(Method)
	method.Insert(1)
	method.Insert(2)
	for v := range method.items {
		fmt.Println(v)
	}
}
// Go里，把方法作为接收器，只有结构体的实例，即接收器，才能调用方法，结构体没有自己的方法。
// 其大致格式如下
func (接收器变量 类型) 方法名　(参数列表) (返回参数)　{
    body
}
// 当接收器不是指针的时候，对接收器对象的更改是不会作用到接收器对象上去的
type Point struct{
    x int
    y int
}
func (p Point) Add(other Point) Point{
    return Point{p.x + other.x, p.y + other.y}
}
```

## interface

```go
type 接口名称　interface {
    method1(args) (return value list)
    method2(args) (return value list)
}
```

Go 的接口是非侵入式的，实现接口并不影响接口，也不需要引入接口的包，只需要完全实现接口的方法

```go
// main package
package main

import (
	"./myioImpl"
	"./myio"
)
func main () {
	m := new(myioImpl.MyioImpl)
	var inter myio.Writer = m
	inter.WriteInt(7)
}

// myio package
package myio

type Writer interface {
    // 这里data是空接口类型，类似java里的Object
	WriteInt(data interface{}) error
}

func Add(x,y int) int {
	return x+y
}

// myioImpl
package myioImpl

import(
	"fmt"
)
type MyioImpl struct {
}

func (writer *MyioImpl)WriteInt(data interface{}) error{
	fmt.Println(data)
	return nil
}

structure
|
 myio
    |myio.go
|
 myioImpl
    |myioImpl.go
|
 main.go
```

#### 实现接口需要函数名一致

#### 实现接口需要方法参数一致

#### 必须实现接口的所有方法才算实现了接口

## Package

- 标识符首字母小写在包外是无法访问的，只有首字母大写才能在包外进行访问

## Parallel

Go 中采用`go func()`形式来使用 Go 管理的 goroutine,goroutine 类似线程，但是调度和管理由 Go 进行管理,Go 会合理的将这些 goroutine 分配到每个 Cpu 上去

```go

```

## Unit test

Go 自带一个`Testing`包及 go test 工具

- 测试文件必须是`[name]_test`格式，命名必须以`_test`结尾。
- 测试函数必须以`Test`开头,参数必须是`*Testing.T`

```go
package learntest

import "testing"

func TestSum(t *testing.T)  {
	res := Sum(1, 2)
	if res != 3 {
		t.Fatal("Test failed")
	} else {
		t.Log("Test Passed")
	}
}
```

```go
package learntest


func Sum(n1 int, n2 int) int {
	return n1 + n2
}
```

> go test -v file_test.go file.go
