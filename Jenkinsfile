
pipeline {
    agent any 

    stages {
        stage('Build') { 
            steps { 
                dependencyCheck additionalArguments: '', odcInstallation: 'OWASP-dependency-check', skipOnScmChange: true 
            }
        }
     }
}	
        
