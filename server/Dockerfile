FROM node:14

WORKDIR /server

RUN apt-get -qy update
RUN apt-get -qy install openssl

COPY package*.json ./

RUN npm i --silent

COPY . .

EXPOSE 3000

#RUN npx prisma migrate --experimental save
#RUN npx prisma migrate --experimental up --auto-approve --create-db
RUN npx prisma generate
#RUN npm run generate
CMD [ "npm", "run", "start:dev"]
