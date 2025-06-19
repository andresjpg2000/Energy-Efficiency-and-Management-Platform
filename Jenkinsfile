pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }
    }
}
