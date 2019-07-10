# Docker

Build mysql docker with `create_table.sql`
```
sudo docker run --network=test-network --name mysql-jing -v /home/ubuntu/Github/Jing/code/UserService/sql/:/root/sql/ -e MYSQL_ROOT_PASSWORD=jing -d mysql:5.6
```

Execute
```
sudo docker exec -it mysql-jing bash
```

Bind network, files and start
```
sudo docker run -dit --name jing-test --network=test-network -v /home/ubuntu/go/src:/go/src -v /home/ubuntu/Github/Jing/code/UserService/:/go/src/UserService/ -p 30252:30251 jing:latest
```

Execute
```
sudo docker exec -it jing-test bash
```
