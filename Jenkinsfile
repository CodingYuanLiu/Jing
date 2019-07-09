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
            docker build -t jing855/login:latest .
            docker login -u jing855 -p summer855
            docker push jing855/login:latest
            """
            sh """
            ls
            cd code
            ls
            cd api-gateway
            ls
            go build main.go
            docker build -t jing855/apigateway:latest .
            docker login -u jing855 -p summer855
            docker push jing855/apigateway:latest
            """
            sh """
            ls
            cd code
            ls
            cd user
            ls
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
