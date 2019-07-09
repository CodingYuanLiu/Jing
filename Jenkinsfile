def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Fetch') {

            echo 'Building..'
            git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
            
        }
        stage('Build') {
            sh """
            ls
            cd code
            ls
            cd login 
            ls
            go build login.go
            sudo docker build -t sebastianj1w/login:latest .
            sudo docker push sebastianj1w/login:latest
            """
            sh """
            ls
            cd code
            ls
            cd api-gateway
            ls
            go build main.go
            sudo docker build -t sebastianj1w/apigateway:latest .
            sudo docker push sebastianj1w/apigateway:latest
            """
            sh """
            ls
            cd code
            ls
            cd user
            ls
            go build user.go
            sudo docker build -t sebastianj1w/user:latest .
            sudo docker push sebastianj1w/user:latest
            """
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
