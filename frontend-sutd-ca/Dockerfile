FROM node:8.15.1-alpine

WORKDIR /app
COPY . /app
# Install yarn from the local .tgz
RUN apk add yarn
RUN yarn
EXPOSE 3000
RUN yarn build
RUN yarn global add serve
CMD serve -s build -l 3000