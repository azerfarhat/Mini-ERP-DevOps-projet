# Étape 1 : construire l'application
FROM node:18 AS builder
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : serveur nginx pour héberger le build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Nettoyer et copier le build
RUN rm -rf ./*
COPY --from=builder /app/dist .

# Exposer le port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
