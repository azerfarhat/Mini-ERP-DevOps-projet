# --- STAGE 1: Build ---
FROM node:18-alpine AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances et les installe
COPY package*.json ./
RUN npm install

# Copie le reste du code source
COPY . .

# Lance la commande de build de Vite (qui crée un dossier /dist)
RUN npm run build

# --- STAGE 2: Serve ---
FROM nginx:1.23-alpine

# Expose le port 80
EXPOSE 80

# === CORRECTION ICI ===
# Copie les fichiers du dossier /dist (créé par Vite)
# dans le dossier par défaut où Nginx sert les fichiers
COPY --from=build /app/dist /usr/share/nginx/html