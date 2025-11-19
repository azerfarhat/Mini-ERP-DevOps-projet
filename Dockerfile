# --- STAGE 1: Build ---
# On utilise une image Node.js complète pour installer les dépendances et construire l'application
FROM node:18-alpine AS build

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le package.json et package-lock.json pour installer les dépendances
# On fait ça en premier pour profiter du cache de Docker
COPY package*.json ./
RUN npm install

# Copie le reste du code source de l'application
COPY . .

# Lance la commande de build de React, qui crée un dossier /build optimisé
RUN npm run build

# --- STAGE 2: Serve ---
# On utilise une image très légère avec un serveur web (Nginx) pour servir les fichiers statiques
FROM nginx:1.23-alpine

# On expose le port 80, qui est le port par défaut de Nginx
EXPOSE 80

# Copie les fichiers HTML/CSS/JS du dossier /build (créé au stage 1)
# dans le dossier par défaut où Nginx sert les fichiers
COPY --from=build /app/build /usr/share/nginx/html

# La commande par défaut de l'image Nginx démarre le serveur automatiquement,
# donc pas besoin de CMD ou ENTRYPOINT.