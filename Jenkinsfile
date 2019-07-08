def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('checkout git') {
            checkout develop
            sh 'ls'
            sh 'echo "hello"'
        }
        stage('another') {
            echo 'hello'
        }
    }
}
