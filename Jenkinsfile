def label = "jenkins-jnlp-slave"
podTemplate(label: label, cloud: 'kubernetes') {
    node(label){
        stage('Build') {
            echo 'Building..'
        }
        stage('Test') {
            echo 'Testing..'
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
