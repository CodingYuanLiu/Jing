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
            cd ..
            """
            sh """
            cd api-gateway
            ls
            go build main.go
            cd ..
            """
            sh """
            cd user 
            ls
            go build user.go
            cd ..
            """
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
