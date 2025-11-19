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
                echo "Récupération du code..."
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
                sh "docker build -t ${IMAGE_NAME}:${BUILD_TAG} ."
            }
        }
        // STAGE 4: Run (Docker)
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                // On mappe le port 8080 de l'hôte au port 80 du conteneur Nginx
                sh "docker run -d --name ${CONTAINER_NAME} -p 8080:80 ${IMAGE_NAME}:${BUILD_TAG}"
            }
        }
        // STAGE 5: Smoke Test
        stage('Smoke Test') {
            steps {
                script {
                    echo "Attente que le serveur Nginx démarre (très rapide)..."
                    // Nginx est très rapide, une petite pause suffit souvent.
                    // Mais une boucle reste plus robuste.
                    sh """
                        sleep 5 # Laisse le temps au conteneur de se stabiliser
                        curl --silent --fail http://localhost:8080 | grep 'React App'
                    """
                    echo "Smoke Test PASS: Le serveur web répond et le contenu attendu est présent."
                }
            }
        }
        // STAGE 6: Archive Artifacts
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build de l'application..."
                // On ne peut pas archiver directement car le build est dans l'image.
                // Une solution simple est de le recréer à l'extérieur.
                // NOTE: Pour cela, l'agent Jenkins doit avoir Node.js installé.
                // Une meilleure solution serait d'utiliser un agent Docker avec Node.
                sh 'npm install && npm run build'
                archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: true
            }
        }
        // Stage conditionnel pour le build versionné
        stage('Publish Versioned Build') {
            when {
                tag "v*.*.*"
            }
            steps {
                echo "Ceci est un build de release pour le tag ${env.TAG_NAME}."
                echo "Ici, on pourrait pousser l'image sur Docker Hub."
                // Exemple pour pousser l'image :
                // withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                //    sh "echo ${PASS} | docker login -u ${USER} --password-stdin"
                //    sh "docker push ${IMAGE_NAME}:${env.TAG_NAME}"
                // }
            }
        }
    }
    // Stage de Cleanup
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
        }
    }
}