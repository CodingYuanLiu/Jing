def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('checkout git') {
            checkout develop
            sh 'ls'
        }
        stage('another') {
            echo 'hello'
        }
    }
}
