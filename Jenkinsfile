def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Build') {
            echo 'Building..'
            git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
            sh 'ls'
        }
        stage('Test') {
            echo 'Testing..'
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
