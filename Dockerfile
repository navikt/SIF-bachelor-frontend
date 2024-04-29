FROM node:20.5.0-alpine

WORKDIR /sif-vju-frontend/src
RUN apk add dumb-init

COPY public/ sif-vju-frontend/public
COPY src/ sif-vju-frontend/src
COPY package.json .
RUN npm install

EXPOSE 3000
#serve for å starte en statisk server isteden
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "npx", "serve", "build" ] 
