pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-react-test'
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Récupération du code..."
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                script {
                    if (env.CHANGE_ID) {
                        env.BUILD_TAG = "pr-${env.CHANGE_ID}-build-${env.BUILD_NUMBER}"
                    } else if (env.BRANCH_NAME == 'dev') {
                        env.BUILD_TAG = "dev-build-${env.BUILD_NUMBER}"
                    } else if (env.TAG_NAME) {
                        env.BUILD_TAG = env.TAG_NAME
                    } else {
                        env.BUILD_TAG = "local-build-${env.BUILD_NUMBER}"
                    }
                    echo "BUILD TAG ➜ ${env.BUILD_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                bat "docker build -t %IMAGE_NAME%:%BUILD_TAG% ."
            }
        }

        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur..."
                bat "docker run -d --name %CONTAINER_NAME% -p 8088:80 %IMAGE_NAME%:%BUILD_TAG%"
            }
        }

        stage('Smoke Test') {
            steps {
                script {
                    echo "Test de la page web..."
                    bat """
                        timeout 5 >nul
                        curl.exe -s -f http://localhost:8088 | findstr "Mini ERP"
                    """
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo "Archivage des artefacts..."
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Nettoyage du conteneur..."
            bat "docker stop %CONTAINER_NAME% 2>nul || ver > nul"
            bat "docker rm %CONTAINER_NAME% 2>nul || ver > nul"
        }
    }
}
