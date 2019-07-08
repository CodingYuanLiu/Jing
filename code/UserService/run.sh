sudo docker run -dit --name jing --network=test-network -v /home/ubuntu/go/src:/go/src -v /home/ubuntu/Github/Jing/code/UserService/:/go/src/UserService/ -p 30251:30251 jing:latest
sudo docker exec -it jing bash
sudo docker container stop jing
sudo docker rm jing

