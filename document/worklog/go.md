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

```
