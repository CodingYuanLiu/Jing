
podTemplate(label: 'jenkins-jnlp-slave', cloud: 'Kubernetes', containers: [
    containerTemplate(
        name: 'jnlp', 
        image: 'sebastianj1w/jnlp-slave:latest', 
        alwaysPullImage: true, 
        args: '${computer.jnlpmac} ${computer.name}'),
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    hostPathVolume(mountPath: '/usr/lib', hostPath: '/usr/lib'),
    hostPathVolume(mountPath: '/usr/include', hostPath: '/usr/include'),
    hostPathVolume(mountPath: '/usr/bin/gcc', hostPath: '/usr/bin/gcc'),
    hostPathVolume(mountPath: '/usr/bin/ld', hostPath: '/usr/bin/ld'),
    hostPathVolume(mountPath: '/usr/bin/as', hostPath: '/usr/bin/as'),
],) 
node(jenkins-jnlp-slave){
    stage('Fetch') {
        echo 'Fetching..'
        git url: 'https://github.com/CodingYuanLiu/Jing.git', branch: 'develop'
        
    }
    stage('Build') {
        echo 'Building..'
        sh "go version"
        sh """
        cd code/backend/activity
        go build main.go
        docker build -t jing855/activity:latest .
        """
        sh """
        cd code/backend/api-gateway             
        go build main.go
        docker build -t jing855/apigateway:latest .
        """
        sh """
        cd code/backend/login 
        go build login.go
        docker build -t jing855/login:latest .
        """
        sh """
        cd code/backend/user
        go build user.go
        docker build -t jing855/user:latest .
        """
         
    }
    stage('Push') {
        echo 'Pushing....'
        sh """
        docker login -u jing855 -p summer855
        docker push jing855/apigateway:latest
        docker push jing855/login:latest
        docker push jing855/user:latest
        docker push jing855/activity:latest
        """
    }
}