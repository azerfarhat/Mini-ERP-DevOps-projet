pipeline {
    // Fait tourner le pipeline sur n'importe quel agent disponible
    agent any
    
    // Définit les outils à préparer avant de lancer les stages.
    tools {
        // ⚠️ ATTENTION : Ce nom 'NodeJS' doit correspondre EXACTEMENT
        // au nom configuré dans Administrer Jenkins > Tools.
        // Si ça ne marche pas, vérifiez la casse (ex: 'nodejs', 'Node-JS'...)
        nodejs 'NodeJS' 
    }

    // Variables d'environnement utilisées dans tout le pipeline
    environment {
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
                    // Logique pour définir le tag de l'image Docker
                    if (env.BRANCH_NAME == 'dev') {
                        env.BUILD_TAG = "dev-build-${env.BUILD_NUMBER}"
                    } else if (env.TAG_NAME) {
                        env.BUILD_TAG = env.TAG_NAME
                    } else {
                        env.BUILD_TAD = "snapshot-${env.BUILD_NUMBER}"
                    }
                    echo "Le tag pour cette exécution sera : ${env.BUILD_TAG}"
                }
            }
        }
        
        // STAGE 3: Installation des dépendances et Build de l'application
        stage('Install & Build') {
            steps {
                echo "Installation des dépendances et construction de l'application..."
                // 'npm' est maintenant disponible grâce au bloc 'tools'
                bat "npm install && npm run build"
            }
        }
        
        // STAGE 4: Archivage des artefacts
        stage('Archive Artifacts') {
            steps {
                echo "Archivage du build de l'application..."
                // Archive le dossier 'dist' qui vient d'être créé à l'étape précédente
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }

        // STAGE 5: Construction de l'image Docker
        stage('Build Docker Image') {
            steps {
                echo "Construction de l'image Docker React..."
                // Ce build utilise le Dockerfile simplifié qui copie le dossier 'dist' local
                bat "docker build -t %IMAGE_NAME%:%BUILD_TAG% ."
            }
        }

        // STAGE 6: Démarrage du conteneur pour le test
        stage('Run Container for Test') {
            steps {
                echo "Démarrage du conteneur ${CONTAINER_NAME} pour le test..."
                bat "docker run -d --name %CONTAINER_NAME% -p 8088:80 %IMAGE_NAME%:%BUILD_TAG%"
            }
        }

        // STAGE 7: Test de fumée (Smoke Test)
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

        // Stage conditionnel
        stage('Publish Versioned Build') {
            when {
                tag "v*.*.*"
            }
            steps {
                echo "Publication du build de release pour le tag ${env.TAG_NAME}..."
                // Ici, vous ajouteriez la commande 'docker push'
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