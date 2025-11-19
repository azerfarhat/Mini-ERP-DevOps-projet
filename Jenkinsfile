pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-react-test'
    }

    stages {

        /* ========= STAGE 1 : CHECKOUT ========= */
        stage('Checkout') {
            steps {
                echo "Récupération du code..."
                checkout scm
            }
        }

        /* ========= STAGE 2 : SETUP ========= */
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
                    echo "Le tag pour cette exécution sera : ${env.BUILD_TAG}"
                }
            }
        }

        /* ========= STAGE 3 : BUILD DOCKER ========= */
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                sh "docker build -t ${IMAGE_NAME}:${BUILD_TAG} ."
            }
        }

        /* ========= STAGE 4 : RUN CONTAINER ========= */
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                sh "docker run -d --name ${CONTAINER_NAME} -p 8088:80 ${IMAGE_NAME}:${BUILD_TAG}"
            }
        }

        /* ========= STAGE 5 : SMOKE TEST ========= */
        stage('Smoke Test') {
            steps {
                script {
                    echo "Attente que le serveur démarre..."
                    sh """
                        sleep 5
                        curl --silent --fail http://localhost:8088 | grep 'Mini ERP'
                    """
                    echo "Smoke Test PASS ✔"
                }
            }
        }

        /* ========= STAGE 6 : ARCHIVE ARTIFACTS ========= */
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build (dossier dist)..."
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
    }

    /* ========= POST ACTIONS ========= */
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
        }
    }
}
