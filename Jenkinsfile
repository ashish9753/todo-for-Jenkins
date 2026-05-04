pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')
        DOCKER_HUB_PASSWORD = credentials('DOCKER_HUB_PASSWORD')
        MONGO_URI = credentials('MONGO_URI')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling the code from github...'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    echo 'Backend dependencies installing...'
                    bat 'npm install'
                }
            }
        }

        stage('Run tests') {
            steps {
                dir('backend') {
                    echo 'Testing the backend...'
                    bat 'npm test'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building Backend Docker image...'
                bat 'docker build -t %DOCKER_HUB_USERNAME%/todo-backend:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building Frontend Docker image...'
                bat 'docker build -t %DOCKER_HUB_USERNAME%/todo-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing to Docker Hub...'
                bat 'echo %DOCKER_HUB_PASSWORD% | docker login -u %DOCKER_HUB_USERNAME% --password-stdin'
                bat 'docker push %DOCKER_HUB_USERNAME%/todo-backend:latest'
                bat 'docker push %DOCKER_HUB_USERNAME%/todo-frontend:latest'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app...'
                bat '''
                set MONGO_URI=%MONGO_URI%
                docker-compose down
                docker-compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline success! App deploy ho gayi.'
        }
        failure {
            echo 'Pipeline fail hui. Kuch toot gaya — deploy nahi hua.'
        }
    }
}