kubectl logs -n $1 `kubectl get pod -n $1 -oname | grep $2` 
