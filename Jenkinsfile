pipeline {
    // Fait tourner le pipeline sur n'importe quel agent disponible
    agent any
    
    // (Removed tools block) We avoid relying on a pre-configured NodeJS tool
    // because some Jenkins agents (Windows) may not have it configured.

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
        stage('Install & Build') {
            steps {
                script {
                    echo "Vérification de l'existence de 'dist' et construction si nécessaire..."
                    // Sur les agents Windows, nous utilisons Docker pour exécuter un conteneur Node
                    // qui montera le workspace et exécutera npm install && npm run build.
                    // Cela évite d'exiger Node/npm installé sur l'agent.
                    // Run the Node container as root to avoid permission issues when
                    // mounting a Windows workspace into the Linux container.
                    bat "if exist dist (echo dist exists) else (docker run --rm -u 0 -v %WORKSPACE%:/work -w /work node:18-alpine sh -c \"npm install --no-audit --no-fund && npm run build\")"
                }
            }
        }

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
                // Nous n'exécutons plus 'npm' sur l'agent Windows (pas toujours installé).
                // L'image Docker construite au stage précédent contient déjà les fichiers
                // statiques dans '/usr/share/nginx/html' (copiés depuis /app/dist).
                // Ici on crée un conteneur temporaire à partir de l'image, on copie
                // le contenu vers le workspace Jenkins, puis on archive.
                bat "if exist dist rmdir /s /q dist || echo no dist"
                bat "docker create --name tmp_extract %IMAGE_NAME%:%BUILD_TAG%"
                bat "docker cp tmp_extract:/usr/share/nginx/html ./dist"
                bat "docker rm tmp_extract"
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