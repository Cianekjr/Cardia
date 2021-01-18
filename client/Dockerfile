FROM node:14

WORKDIR /client

RUN apt-get -qy update

COPY package*.json ./

#RUN npm rebuild node-sass

RUN npm i --silent

COPY . .

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "serve"]
