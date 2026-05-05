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
                    echo 'Installing backend dependencies...'
                    bat '''
                    node -v
                    npm -v
                    npm cache clean --force
                    npm install --force
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    echo 'Running tests...'
                    bat 'npm test'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building backend Docker image...'
                bat 'docker build -t %DOCKER_USER%/todo-backend:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building frontend Docker image...'
                bat 'docker build -t %DOCKER_USER%/todo-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Logging into Docker Hub & pushing images...'

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    powershell '''
                    Write-Host "Logging into Docker Hub..."
                    $env:DOCKER_PASS | docker login -u $env:DOCKER_USER --password-stdin

                    Write-Host "Pushing backend image..."
                    docker push $env:DOCKER_USER/todo-backend:latest

                    Write-Host "Pushing frontend image..."
                    docker push $env:DOCKER_USER/todo-frontend:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline SUCCESS: Images pushed to Docker Hub!'
        }
        failure {
            echo '❌ Pipeline FAILED: Check logs for errors.'
        }
    }
}