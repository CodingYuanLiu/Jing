def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Fetch') {
            sh "uname -a"
            echo 'Building..'
            git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
            
        }
        stage('Build') {
            sh "go version"
            sh """
            cd code/backend/api-gateway             
            go build main.go
            docker build -t jing855/apigateway:latest .
            docker login -u jing855 -p summer855
            docker push jing855/apigateway:latest
            """
            sh """
            cd code/backend/login 
            go build login.go
            docker build -t jing855/login:latest .
            docker login -u jing855 -p summer855
            docker push jing855/login:latest
            """
            sh """
            cd code/backend/user
            go build user.go
            docker build -t jing855/user:latest .
            docker login -u jing855 -p summer855
            docker push jing855/user:latest
            """
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
