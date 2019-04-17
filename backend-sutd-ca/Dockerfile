FROM node:8.15.1-alpine

WORKDIR /app
COPY . /app
# Install yarn from the local .tgz
RUN apk add yarn
RUN apk add --update openssl
RUN yarn
RUN echo PROJ_PATH=/app > .env
EXPOSE 8000
CMD [ "node", "index.js" ]