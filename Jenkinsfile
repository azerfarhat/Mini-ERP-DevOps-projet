pipeline {
    // Fait tourner le pipeline sur n'importe quel agent disponible
    agent any
    
    // Définit les outils à préparer avant de lancer les stages.
    // Jenkins va s'assurer que Node.js est disponible.
    tools {
        // Le nom 'NodeJS' doit correspondre EXACTEMENT
        // au nom que vous avez configuré dans Administrer Jenkins > Tools
        nodejs 'NodeJS' 
    }

    // Variables d'environnement utilisées dans tout le pipeline
    environment {
        // REMPLACEZ 'azerfarhat' par votre ID Docker Hub
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-react-test'
    }

    stages {
        // STAGE 1: Récupération du code
        stage('Checkout') {
            steps {
                echo "Récupération du code depuis GitHub..."
                checkout scm
            }
        }

        // STAGE 2: Préparation des variables de build
        stage('Setup') {
            steps {
                script {
                    if (env.CHANGE_ID) { // Cas d'une Pull Request
                        env.BUILD_TAG = "pr-${env.CHANGE_ID}-build-${env.BUILD_NUMBER}"
                    } else if (env.BRANCH_NAME == 'dev') { // Cas d'un push sur 'dev'
                        env.BUILD_TAG = "dev-build-${env.BUILD_NUMBER}"
                    } else if (env.TAG_NAME) { // Cas d'un tag de version
                        env.BUILD_TAG = env.TAG_NAME
                    } else {
                        env.BUILD_TAG = "local-build-${env.BUILD_NUMBER}"
                    }
                    echo "Le tag pour cette exécution sera : ${env.BUILD_TAG}"
                }
            }
        }

        // STAGE 3: Construction de l'image Docker
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                // Utilise 'bat' pour Windows et les variables %VAR%
                bat "docker build -t %IMAGE_NAME%:%BUILD_TAG% ."
            }
        }

        // STAGE 4: Démarrage du conteneur pour le test
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                // Utilise le port 8088 pour ne pas entrer en conflit avec Jenkins (port 8080)
                bat "docker run -d --name %CONTAINER_NAME% -p 8088:80 %IMAGE_NAME%:%BUILD_TAG%"
            }
        }

        // STAGE 5: Test de fumée (Smoke Test)
        stage('Smoke Test') {
            steps {
                script {
                    echo "Attente que le serveur Nginx démarre (10 secondes)..."
                    // 'ping' est utilisé comme pause compatible avec Windows
                    bat "ping -n 11 127.0.0.1 > nul"
                    
                    echo "Lancement du Smoke Test..."
                    // Teste sur le port 8088 et cherche le titre de votre application
                    // REMPLACEZ "Mini ERP" si le titre dans votre index.html est différent
                    bat "curl http://localhost:8088 | find \"Mini ERP\""
                }
            }
        }

        // STAGE 6: Archivage des artefacts
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build de l'application..."
                // 'npm' est maintenant disponible grâce au bloc 'tools'
                bat "npm install && npm run build"
                // Archive le dossier 'dist' (généré par Vite)
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }

        // Stage conditionnel qui ne s'exécute que pour un tag de version
        stage('Publish Versioned Build') {
            when {
                tag "v*.*.*"
            }
            steps {
                echo "Ceci est un build de release pour le tag ${env.TAG_NAME}."
                // Ici, vous pourriez ajouter les commandes pour pousser l'image sur Docker Hub
            }
        }
    }

    // Actions à exécuter à la fin du pipeline, qu'il réussisse ou échoue
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            // Commandes Windows pour arrêter et supprimer le conteneur proprement
            bat "docker stop %CONTAINER_NAME% 2>nul || ver > nul"
            bat "docker rm %CONTAINER_NAME% 2>nul || ver > nul"
        }
    }
}