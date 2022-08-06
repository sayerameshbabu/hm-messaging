pipeline{
    environment{
        imagename= 'lvtlabs/hm-messaging'
        registryCredential = 'ramesh-docker-cred'
        dockerImage = ''
    }
    agent any
    stages{
        stage('Cloning git'){
            steps{
                git branch: 'qa', credentialsId: 'ramesh-github-tokens', url: 'https://github.com/lvtlabs/hm-messaging.git'

            }

        }
        stage('Building Docker Image') {
                      
            steps{
                // sh 'docker build -t ${imagename} -t lvtlabs/hm-messaging:${BUILD_NUMBER} .'
               script{
                   dockerImage = docker.build(imagename, ' .') 
               } 
                
            }
        }
        stage('Deploy Image') {
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push('latest')
                        dockerImage.push("${BUILD_NUMBER}")
                    }
                }
            }
        }
        
    }
}
