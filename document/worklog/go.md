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
    "spring",
    "winter"}

```
