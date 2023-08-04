from node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8888

CMD [ "node", "server.js" ]