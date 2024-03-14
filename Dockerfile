FROM node:19.5.0-alpine

WORKDIR /sif-vju-frontend

COPY public/ sif-vju-frontend/public
COPY src/ sif-vju-frontend/src
COPY package.json sif-vju-frontend
RUN npm start

#CMD ["npm", "start"]