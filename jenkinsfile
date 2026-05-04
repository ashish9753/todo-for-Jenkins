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

        stages('Install Backend Dependencies') {
            steps {
                echo 'Backend dependencies installing...'
                sh 'npm install'
            }
        }

        stages('Run tests') {
            steps {
                echo 'Testing the backend...'
                sh 'npm test'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Backend Docker image build kar raha hoon...'
                sh 'docker build -t $DOCKER_HUB_USERNAME/todo-backend:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo 'Frontend Docker image build kar raha hoon...'
                sh 'docker build -t $DOCKER_HUB_USERNAME/todo-frontend:latest ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Docker Hub pe push kar raha hoon...'
                sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                sh 'docker push $DOCKER_HUB_USERNAME/todo-backend:latest'
                sh 'docker push $DOCKER_HUB_USERNAME/todo-frontend:latest'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy kar raha hoon...'
                sh '''
                    export MONGO_URI=$MONGO_URI
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