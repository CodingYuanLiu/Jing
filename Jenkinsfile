def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Fetch') {
            echo 'Fetching...'
            git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
            
        }
        stage('Build') {
            echo 'Building...'
            sh "go version"
            sh """
            cd code/backend/activity
            go build main.go
            docker build -t jing855/activity:latest .
            """
            sh """
            cd code/backend/api-gateway             
            go build main.go
            docker build -t jing855/apigateway:latest .
            """
            sh """
            cd code/backend/login 
            go build login.go
            docker build -t jing855/login:latest .
            """
            sh """
            cd code/backend/user
            go build user.go
            docker build -t jing855/user:latest .
            """
            sh """
            cd code/backend/feedback
            go build main.go
            docker build -t jing855/feedback:latest .
            """
        }
        stage('Push') {
            echo 'Pushing...'
            sh """
            docker login -u jing855 -p summer855
            docker push jing855/apigateway:latest
            docker push jing855/login:latest
            docker push jing855/user:latest
            docker push jing855/activity:latest
            docker push jing855/feedback:latest
            """
        }
    }
}
