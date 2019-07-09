def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Fetch') {

            echo 'Building..'
            git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
            steps {
                sh 'ls'
                sh 'cd code'
                sh 'ls'
                sh 'cd login' 
                sh 'ls'
            }
        }
        stage('Build') {
            echo 'Building'
            sh 'ls'
            sh 'go build login.go'
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
