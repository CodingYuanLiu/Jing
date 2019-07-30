def label = "mypod-${UUID.randomUUID().toString()}"
podTemplate(label: label, cloud: 'kubernetes',containers: [
    containerTemplate(
        name: 'jnlp', 
        image: 'huwanyang168/jenkins-slave-maven:latest', 
        alwaysPullImage: false, 
        args: '${computer.jnlpmac} ${computer.name}'),
  ]) {

    node(label) {
        stage('stage1') {
            stage('Show Maven version') {
                sh 'mvn -version'
                sh 'sleep 60s'
            }
        }
    }
}