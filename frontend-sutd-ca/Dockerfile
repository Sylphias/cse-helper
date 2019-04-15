FROM node:8.15.1-alpine

WORKDIR /app
COPY . /app
# Install yarn from the local .tgz
RUN apk add yarn
RUN yarn
EXPOSE 3000
CMD [ "yarn", "start" ]