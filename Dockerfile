# Utiliser une image de base Node.js LTS
FROM node:20-alpine

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier le package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Creer le dossier de config
RUN mkdir /configs

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Définir la commande par défaut pour démarrer l'application
CMD ["npm", "start"]