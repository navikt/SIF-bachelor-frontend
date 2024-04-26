FROM node:20.5.0-alpine

WORKDIR /sif-vju-frontend/src

COPY public/ sif-vju-frontend/public
COPY src/ sif-vju-frontend/src
COPY package.json .
RUN npm install


CMD ["npm", "build"]
#serve for å starte en statisk server isteden
CMD [ "npx", "serve" ] 
COPY . .
EXPOSE 3000

