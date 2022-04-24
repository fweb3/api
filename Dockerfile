FROM node:16-alpine
COPY . ./app
WORKDIR /app
RUN npm install --only=production
CMD npm run build
CMD npm run start
