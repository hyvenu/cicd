// Declarative //
pipeline {
    agent any 

    stages {
        stage('Checkout') { 
            steps { 
                checkout([$class: 'GitSCM', branches: [[name: '*/${BRANCH}']], extensions: [], userRemoteConfigs: [[credentialsId: 'jenkins_ssh-key', url: 'git@github.com:CraftYourIdea/ERP-Project.git']]]) 
            }
        }
        stage('Test'){
            steps {
                sh 'make check'
                junit 'reports/**/*.xml' 
            }
        }
        stage('Deploy') {
            steps {
                sh 'make publish'
            }
        }
    }
}
