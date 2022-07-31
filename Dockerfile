FROM node:16-alpine

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . .

RUN npm run build
CMD npm run start
