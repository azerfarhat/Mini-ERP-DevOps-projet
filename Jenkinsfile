pipeline {
    agent any
    environment {
        // REMPLACEZ 'azerfarhat' par votre ID Docker Hub
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-react-test'
    }
    stages {
        // STAGE 1: Checkout
        stage('Checkout') {
            steps {
                echo "Récupération du code depuis GitHub..."
                checkout scm
            }
        }
        // STAGE 2: Setup
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
        // STAGE 3: Build
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                bat "docker build -t %IMAGE_NAME%:%BUILD_TAG% ."
            }
        }
        // STAGE 4: Run (Docker)
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                // --- MODIFICATION ICI ---
                // On utilise le port 8088 qui est probablement libre
                bat "docker run -d --name %CONTAINER_NAME% -p 8088:80 %IMAGE_NAME%:%BUILD_TAG%"
            }
        }
        // STAGE 5: Smoke Test
        stage('Smoke Test') {
            steps {
                script {
                    echo "Attente que le serveur Nginx démarre..."
                    bat "timeout /t 10"
                    
                    echo "Lancement du Smoke Test..."
                    // --- MODIFICATION ICI ---
                    // On teste sur le port 8088
                    bat "curl http://localhost:8088 | find \"React App\""
                }
            }
        }
        // STAGE 6: Archive Artifacts
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build de l'application..."
                // Correction : le dossier est 'dist', pas 'build'
                bat "npm install && npm run build"
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
        // Stage conditionnel pour le build versionné
        stage('Publish Versioned Build') {
            when {
                tag "v*.*.*"
            }
            steps {
                echo "Ceci est un build de release pour le tag ${env.TAG_NAME}."
            }
        }
    }
    // Stage de Cleanup
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            bat "docker stop %CONTAINER_NAME% 2>nul || ver > nul"
            bat "docker rm %CONTAINER_NAME% 2>nul || ver > nul"
        }
    }
}