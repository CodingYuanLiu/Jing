name=`kubectl get pod -n database -oname | grep redis`

echo `kubectl delete -n database $name` 
