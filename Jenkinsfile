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
            """
        }
        stage('Deploy') {
            echo 'Deploying....'
        }
    }
}
