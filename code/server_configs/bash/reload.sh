#!/bin/bash

name=`kubectl get pod -n micro -oname | grep activity`
echo `kubectl delete -n micro $name`
name=`kubectl get pod -n micro -oname | grep login`
echo `kubectl delete -n micro $name`
name=`kubectl get pod -n micro -oname | grep user`
echo `kubectl delete -n micro $name`
name=`kubectl get pod -n micro -oname | grep gateway`
echo `kubectl delete -n micro $name`
name=`kubectl get pod -n micro -oname | grep feedback`
echo `kubectl delete -n micro $name`


