pipeline {
    agent any
    environment {
        // REMPLACEZ 'azerfarhat' par votre ID Docker Hub
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-test'
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
                    echo "Le tag pour cette exécution sera : ${env.BUILD_TAG}"
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                // Utilise 'bat' pour Windows
                bat "docker build -t ${IMAGE_NAME}:${BUILD_TAG} ."
            }
        }
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                // Utilise 'bat' pour Windows
                bat "docker run -d --name ${CONTAINER_NAME} -p 8088:80 ${IMAGE_NAME}:${BUILD_TAG}"
            }
        }
        stage('Smoke Test') {
    steps {
        script {
            echo "Attente que le serveur Nginx démarre..."
            bat "ping -n 6 127.0.0.1 > NUL"
            
            echo "Vérification que le titre de la page contient 'Mini ERP'..."
            
            // === CORRECTION ICI ===
            // On recherche la chaîne exacte "Mini ERP". Les guillemets sont nécessaires
            // à cause de l'espace, et ils sont échappés avec \".
            bat "curl --silent --fail http://localhost:8088 | findstr \"Mini ERP\""
            
            echo "Smoke Test PASS: Le serveur web répond et le contenu attendu est présent."
        }
    }
}
        stage('Archive Artifacts') {
    steps {
        echo "Extraction des artefacts depuis l'image Docker..."
        
        // Crée un conteneur temporaire à partir de l'image que nous venons de construire
        bat "docker create --name temp-extractor ${IMAGE_NAME}:${BUILD_TAG}"
        
        // Copie le dossier 'dist' depuis le conteneur vers le workspace Jenkins
        // La syntaxe est "docker cp <nom_conteneur>:<chemin_dans_conteneur> <chemin_local>"
        // Le '.' signifie "le répertoire actuel" (le workspace).
        bat "docker cp temp-extractor:/app/dist ./"
        
        // Supprime le conteneur temporaire qui n'est plus utile
        bat "docker rm temp-extractor"

        echo "Archivage du build..."
        // Archive le dossier 'dist' que nous venons de copier
        archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
        }
    }
        stage('Publish Versioned Build') {
            when {
                tag "v*.*.*"
            }
            steps {
                echo "Ceci est un build de release..."
            }
        }
    }
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            // Utilise 'bat' et '||' pour ignorer les erreurs
            bat "docker stop ${CONTAINER_NAME} || exit 0"
            bat "docker rm ${CONTAINER_NAME} || exit 0"
        }
    }
}