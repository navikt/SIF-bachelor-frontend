FROM node:20.5.0-alpine

WORKDIR /sif-vju-frontend/src

COPY public/ sif-vju-frontend/public
COPY src/ sif-vju-frontend/src
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ['npm', 'start']
