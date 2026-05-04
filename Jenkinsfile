pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = credentials('DOCKER_HUB_USERNAME')
        DOCKER_HUB_PASSWORD = credentials('DOCKER_HUB_PASSWORD')
        MONGO_URI = credentials('MONGO_URI')
        EC2_HOST = credentials('EC2_HOST')
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
                    bat '''
                    node -v
                    npm -v
                    npm cache clean --force
                    npm install --force
                    '''
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
                bat '''
                echo %DOCKER_HUB_PASSWORD% | docker login -u %DOCKER_HUB_USERNAME% --password-stdin
                docker push %DOCKER_HUB_USERNAME%/todo-backend:latest
                docker push %DOCKER_HUB_USERNAME%/todo-frontend:latest
                '''
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo 'Deploying to AWS EC2...'
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'EC2_SSH_KEY',
                        keyFileVariable: 'SSH_KEY_FILE',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    bat """
                    icacls %SSH_KEY_FILE% /inheritance:r /grant:r "%USERNAME%:R"
                    ssh -i %SSH_KEY_FILE% -o StrictHostKeyChecking=no ubuntu@%EC2_HOST% "docker pull %DOCKER_HUB_USERNAME%/todo-backend:latest && docker pull %DOCKER_HUB_USERNAME%/todo-frontend:latest && docker stop todo-backend todo-frontend || true && docker rm todo-backend todo-frontend || true && docker run -d --name todo-backend -p 5000:5000 -e MONGO_URI=%MONGO_URI% %DOCKER_HUB_USERNAME%/todo-backend:latest && docker run -d --name todo-frontend -p 3000:80 %DOCKER_HUB_USERNAME%/todo-frontend:latest"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline success! App AWS pe live hai.'
        }
        failure {
            echo 'Pipeline fail hui. Kuch toot gaya — deploy nahi hua.'
        }
    }
}