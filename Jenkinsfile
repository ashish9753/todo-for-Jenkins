pipeline {
    agent any

    environment {
        MONGO_URI = credentials('MONGO_URI')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat '''
                    node -v
                    npm -v
                    npm install
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {

                withCredentials([
                    string(credentialsId: 'DOCKER_HUB_USERNAME', variable: 'DOCKER_USER'),
                    string(credentialsId: 'DOCKER_HUB_PASSWORD', variable: 'DOCKER_PASS')
                ]) {

                    echo "Using Docker user: %DOCKER_USER%"

                    // BUILD IMAGES
                    bat '''
                    docker build -t %DOCKER_USER%/todo-backend:latest ./backend
                    docker build -t %DOCKER_USER%/todo-frontend:latest ./frontend
                    '''

                    // LOGIN + PUSH (PowerShell safe)
                    powershell '''
                    $env:DOCKER_PASS | docker login -u $env:DOCKER_USER --password-stdin

                    docker push $env:DOCKER_USER/todo-backend:latest
                    docker push $env:DOCKER_USER/todo-frontend:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ SUCCESS: Images pushed to Docker Hub!'
        }
        failure {
            echo '❌ FAILED: Check logs'
        }
    }
}