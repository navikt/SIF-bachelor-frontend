FROM node:20.5.0-alpine

WORKDIR /sif-vju-frontend/ 

COPY public/ public
COPY src/ src
RUN apk add dumb-init
COPY package*.json .

COPY . .
RUN npm install


#CMD ["npm","run", "build"]
#serve for å starte en statisk server isteden
RUN npm run build
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
#CMD [ "npx","serve","-s",  "build" ] 
EXPOSE 3000

