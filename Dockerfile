# --- STAGE 1: Build ---

FROM node:18-alpine AS build


WORKDIR /app



COPY package*.json ./
RUN npm install


COPY . .


RUN npm run build

# --- STAGE 2: Serve ---

FROM nginx:1.23-alpine


EXPOSE 80
# La seule ligne qui a changé est celle-ci :
COPY --from=build /app/dist /usr/share/nginx/html