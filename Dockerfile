FROM node:alpine

MAINTAINER Mupat <dev@mupat.net>

EXPOSE 8080

COPY . ./
RUN npm install

CMD [ "npm", "start" ]
