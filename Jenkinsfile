pipeline {
    // Fait tourner le pipeline sur n'importe quel agent disponible
    agent any
    
    // Définit les outils à préparer avant de lancer les stages.
    tools {
        // ⚠️ ATTENTION : C'est la ligne la plus importante.
        // Ce nom 'NodeJS' doit correspondre EXACTEMENT au nom que vous avez
        // configuré dans Administrer Jenkins > Tools. Si le build échoue
        // encore, le problème est à 100% dans la configuration de Jenkins
        // et non dans ce fichier.
        nodejs 'NodeJS' 
    }

    // Variables d'environnement utilisées dans tout le pipeline
    environment {
        IMAGE_NAME     = 'azerfarhat/mini-erp-react'
        CONTAINER_NAME = 'mini-erp-react-test'
        BUILD_TAG      = "dev-build-${env.BUILD_NUMBER}"
    }

    stages {
        // STAGE 1: Récupération du code
        stage('Checkout') {
            steps {
                echo "Récupération du code depuis GitHub..."
                checkout scm
            }
        }
        
        // STAGE 2: Installation des dépendances et Build de l'application
        stage('Install & Build') {
            steps {
                echo "Installation des dépendances et construction de l'application..."
                // Utilise le 'npm' préparé par Jenkins.
                // Cette commande crée le dossier 'dist/'.
                bat "npm install && npm run build"
            }
        }
        
        // STAGE 3: Archivage des artefacts
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build de l'application..."
                // Archive le dossier 'dist' pour le conserver.
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }

        // STAGE 4: Construction de l'image Docker
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                // Utilise le Dockerfile simplifié qui copie le dossier 'dist' local.
                bat "docker build -t %IMAGE_NAME%:%BUILD_TAG% ."
            }
        }

        // STAGE 5: Démarrage du conteneur pour le test
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                bat "docker run -d --name %CONTAINER_NAME% -p 8088:80 %IMAGE_NAME%:%BUILD_TAG%"
            }
        }

        // STAGE 6: Test de fumée (Smoke Test)
        stage('Smoke Test') {
            steps {
                script {
                    echo "Attente que le serveur Nginx démarre (10 secondes)..."
                    bat "ping -n 11 127.0.0.1 > nul"
                    
                    echo "Lancement du Smoke Test..."
                    bat "curl http://localhost:8088 | find \"Mini ERP\""
                }
            }
        }
    }

    // Actions à exécuter à la fin du pipeline
    post {
        always {
            echo "Nettoyage du conteneur de test..."
            bat "docker stop %CONTAINER_NAME% 2>nul || ver > nul"
            bat "docker rm %CONTAINER_NAME% 2>nul || ver > nul"
        }
    }
}