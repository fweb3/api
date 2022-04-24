FROM node:16-alpine
# RUN addgroup -S fweb3
# RUN adduser -S -D -h /app fweb3 fweb3
# RUN chown -R fweb3:fweb3 /app
# USER fweb3
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
CMD npm run build
COPY ./dist ./
CMD npm run start
