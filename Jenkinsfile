
pipeline {
    agent any 

    stages {
        stage('dependency_check') { 
            steps { 
                dependencyCheck additionalArguments: '', odcInstallation: 'OWASP-dependency-check', skipOnScmChange: true 
            }
        }
     }
}	
        
