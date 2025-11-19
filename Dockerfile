# --- STAGE UNIQUE : SERVIR LES FICHIERS ---

# Utiliser une image Nginx légère et officielle
FROM nginx:1.23-alpine

# Copier le contenu du dossier 'dist' (déjà construit par Jenkins)
# dans le répertoire racine du serveur web Nginx
COPY dist/ /usr/share/nginx/html

# Exposer le port 80 pour les requêtes HTTP
EXPOSE 80

# Commande par défaut pour démarrer Nginx en premier plan lorsque le conteneur démarre
CMD ["nginx", "-g", "daemon off;"]