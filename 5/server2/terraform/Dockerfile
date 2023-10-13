FROM node:18-alpine3.17

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]
