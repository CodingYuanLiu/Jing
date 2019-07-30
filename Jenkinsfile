def label = "mypod-${UUID.randomUUID().toString()}"
podTemplate(label: label, cloud: 'kubernetes',containers: [
    containerTemplate(
        name: 'jnlp', 
        image: 'sebastianj1w/jnlp-slave:latest', 
        alwaysPullImage: false, 
        args: '${computer.jnlpmac} ${computer.name}'),
  ]) {

    node(label) {
        stage('stage1') {
            stage('Show Maven version') {
                sh 'go  version'
                sh 'sleep 60s'
            }
        }
    }
}