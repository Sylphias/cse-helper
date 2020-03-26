FROM node:12.16.1-alpine

WORKDIR /app
COPY . /app
# Install yarn from the local .tgz
RUN apk add yarn
RUN apk add --update openssl
RUN yarn
EXPOSE 8000
CMD [ "node", "index.js" ]
