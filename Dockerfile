FROM node:16-alpine
COPY . ./app
WORKDIR /app
RUN npm install --frozen-lockfile --link-duplicates --silent
RUN npm run build:clean
CMD npm run start
